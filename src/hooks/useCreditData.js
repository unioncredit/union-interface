import { useEffect, useState } from "react";
import { OrderDirection } from "@unioncredit/data/lib/constants";
import {
  config,
  fetchAccountBorrows,
  fetchAccountMembershipApplication,
  fetchAccountRepays,
} from "@unioncredit/data";
import { useProtocolData } from "providers/ProtocolData";
import { getVersion, Versions } from "providers/Version";
import { useMemberData } from "providers/MemberData";
import { BlockSpeed, ZERO } from "constants";
import { SECONDS_PER_DAY } from "../constants";

export function useCreditData(address, chainId) {
  const [borrows, setBorrows] = useState([]);
  const [repays, setRepays] = useState([]);
  const [application, setApplication] = useState({});
  const [history, setHistory] = useState({});
  const [daysInDefault, setDaysInDefault] = useState(0);
  const [daysSinceMembership, setDaysSinceMembership] = useState(0);

  const { data: member } = useMemberData(address, chainId, getVersion(chainId));
  const { data: protocol } = useProtocolData(chainId);

  const { owed = ZERO } = member;
  const { overdueTime = ZERO, overdueBlocks = ZERO } = protocol;

  const overduePeriodSeconds = (getVersion(chainId) === Versions.V2 ? overdueTime : overdueBlocks)
    .mul(BlockSpeed[chainId])
    .div(1000);

  const fetchBorrowsAndRepays = async (address) => {
    const [borrows, repays, applications] = await Promise.all([
      fetchAccountBorrows(address, "timestamp", OrderDirection.ASC),
      fetchAccountRepays(address, "timestamp", OrderDirection.ASC),
      fetchAccountMembershipApplication(address, "timestamp", OrderDirection.ASC),
    ]);

    if (applications.length > 0) {
      setApplication(applications[0]);
    }

    setBorrows(borrows);
    setRepays(repays);
  };

  const getMonthsBetweenDates = (startDate, endDate, callback) => {
    let currentDate = startDate;

    while (currentDate <= endDate) {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      callback({ month, year });

      // Move to the next month
      currentDate.setMonth(month + 1);
    }
  };

  const getDaysBetweenDates = (startDate, endDate) => {
    const diff = Math.abs(startDate - endDate);
    return Math.floor(diff / (SECONDS_PER_DAY * 1000));
  };

  useEffect(() => {
    if (application) {
      const startDate = new Date(application.timestamp * 1000);
      setDaysSinceMembership(getDaysBetweenDates(startDate, new Date()));
    }
  }, [application]);

  useEffect(() => {
    let newDaysInDefault = 0;
    const newHistory = {};

    const createEmptyYear = (year) => {
      const today = new Date();

      // If the provided year is this year, only pre-populate up to the current month
      const maxMonths = today.getFullYear() === year ? today.getMonth() + 1 : 12;

      newHistory[year] = {};
      for (let i = 1; i <= maxMonths; i++) {
        newHistory[year][i] = {
          repays: [],
          borrows: [],
          isOverdue: false,
          isBorrowing: false,
        };
      }
    };

    // Assign borrows to month/year
    borrows.forEach((borrow) => {
      const date = new Date(borrow.timestamp * 1000);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      if (!newHistory[year]) {
        createEmptyYear(year);
      }

      newHistory[year][month]["borrows"].push(borrow);
    });

    // Assign repays to month/year
    repays.forEach((repay) => {
      const date = new Date(repay.timestamp * 1000);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      if (!newHistory[year]) {
        createEmptyYear(year);
      }

      newHistory[year][month]["repays"].push(repay);
    });

    let lastRepay;
    if (borrows.length > 0 && repays.length > 0) {
      const today = new Date();
      let expectedDueDate = null;
      lastRepay = borrows[0].timestamp;

      // Loop each repay and check if it occurred after the due by date
      repays.forEach((repay) => {
        expectedDueDate = parseInt(lastRepay) + overduePeriodSeconds.toNumber();

        if (parseInt(repay.timestamp) > expectedDueDate) {
          let startDate = new Date(expectedDueDate * 1000);
          let endDate = new Date(repay.timestamp * 1000);

          newDaysInDefault += getDaysBetweenDates(startDate, endDate);

          getMonthsBetweenDates(startDate, endDate, ({ month, year }) => {
            newHistory[year][month + 1].isOverdue = true;
          });
        }

        lastRepay = repay.timestamp;
      });

      // Check if the user has an owed balance and has missed the last due date
      const overdueCutoff = parseInt(lastRepay) + overduePeriodSeconds.toNumber();

      if (owed.gt(ZERO) && today.getTime() / 1000 > overdueCutoff) {
        let startDate = new Date(overdueCutoff * 1000);

        newDaysInDefault += getDaysBetweenDates(startDate, today);

        getMonthsBetweenDates(startDate, today, ({ month, year }) => {
          newHistory[year][month + 1].isOverdue = true;
        });
      }
    }

    setHistory(newHistory);
    setDaysInDefault(newDaysInDefault);
  }, [borrows, repays]);

  useEffect(() => {
    if (address && chainId) {
      config.set("chainId", chainId);
      fetchBorrowsAndRepays(address);
    }
  }, [address, chainId]);

  return {
    borrows,
    repays,
    history,
    daysInDefault,
    daysSinceMembership,
    defaultRate: daysSinceMembership > 0 ? (daysInDefault / daysSinceMembership) * 100 : 0,
  };
}
