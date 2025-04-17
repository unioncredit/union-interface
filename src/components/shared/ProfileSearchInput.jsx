import { useRef, useState } from "react";
import { SearchIcon } from "@unioncredit/ui";
import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import cn from "classnames";

import { Input } from "components/ui/Input";
import { useUserSearch } from "hooks/useUserSearch";
import { EIP3770 } from "constants";


export const ProfileSearchInput = ({ className }) => {
  const inputRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { chain } = useAccount();

  const { data: results, isLoading: userSearchLoading } = useUserSearch({
    query: searchQuery,
    limit: 4,
  });

  const handleClose = () => {
    setSearchQuery("");
    setOpen(false);
  };

  return (
    <div
      className={cn("relative ml-1.5 h-[40px] z-10", className)}
    >
      <div className="flex items-center bg-white border rounded-lg h-[40px] md:absolute md:top-0">
        <button
          onClick={() => setOpen(o => !o)}
          className={cn("min-w-[40px] max-w-[40px] min-h-[40px] p-3 rounded-lg", {
            "bg-zinc-100 border border-l-0 rounded-r-none": open,
          })}
        >
          <SearchIcon />
        </button>
        {open && (
          <Input
            autoFocus={true}
            ref={inputRef}
            value={searchQuery}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by address or ENS"
            className="ProfileSearchInput__input text-sm bg-transparent border-none shadow-none pl-2 w-[200px]"
          />
        )}
      </div>

      {open && searchQuery.length > 0 && (
        <ul className="ProfileSearchInput__popover absolute top-[42px] bg-white border w-full mt-1 rounded-lg shadow-md flex flex-col z-10 md:w-[242px]">
          {userSearchLoading ? (
            <li className="px-3 py-2.5 text-center text-sm">Loading users...</li>
          ) : searchQuery.length > 0 && results.length <= 0 ? (
            <li className="px-3 py-2.5 text-center text-sm">No users found</li>
          ) : (
            results.map(({ name, username, address, avatar }, index) => (
              <Link
                key={index}
                onClick={handleClose}
                to={`/profile/${EIP3770[chain.id] || "base"}:${address}`}
              >
                <li
                  className="px-3 py-1.5 flex items-center gap-2 cursor-pointer hover:bg-zinc-100 text-left w-full outline-none focus:bg-zinc-100"
                >
                  <img
                    src={avatar}
                    alt={name}
                    width={32}
                    height={32}
                    className="h-[32px] object-cover border rounded-full"
                  />

                  <div>
                    <h3 className="font-sans font-medium text-sm">{name}</h3>
                    <p className="text-xs text-zinc-400">{username}</p>
                  </div>
                </li>
              </Link>
            ))
          )}
        </ul>
      )}
    </div>
  );
};
