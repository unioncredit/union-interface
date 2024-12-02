import "./InstallAppDrawer.scss";

import { Drawer } from "vaul";
import { ReactComponent as AddToHomeScreenIcon } from "../../images/AddToHomeScreen.svg";

// @ts-ignore
import { ShareIcon, UnionIcon } from "@unioncredit/ui";

export const InstallAppDrawer = () => {
  return (
    <Drawer.Root className="InstallAppDrawer">
      <Drawer.Trigger className="InstallAppDrawer__trigger relative flex h-10 flex-shrink-0 items-center justify-center gap-2 overflow-hidden rounded-xl text-white px-4 text-lg font-medium shadow-sm transition-all bg-[#2A2736] p-8 w-full mb-3">
        <UnionIcon width={24} height={24} />
        Install App
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="bg-gray-100 flex flex-col rounded-t-[10px] mt-24 h-fit fixed bottom-0 left-0 right-0 outline-none text-center">
          <div className="p-4 bg-white rounded-t-[10px] flex-1">
            <div
              aria-hidden
              className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-8"
            />
            <div className="max-w-md mx-auto">
              <img src="/logo192.png" alt="Union Logo" className="m-auto mb-5" />
              <Drawer.Title className="font-medium mb-1 text-gray-900">Install Union</Drawer.Title>
              <p className="text-gray-600 mb-2 text-sm">Add the app to your home screen</p>
              <div className="bg-gray-200 rounded-md p-4 mt-4">
                <p className="flex items-center justify-center">
                  Tap the <ShareIcon width={24} height={24} className="mx-1" /> share icon in your
                  browser
                </p>
                <p className="mt-4 flex items-center justify-center">
                  Select <AddToHomeScreenIcon className="mx-2" /> Add to Home Screen
                </p>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
