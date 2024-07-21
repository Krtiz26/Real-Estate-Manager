import Link from "next/link";
import Image from "next/image";
import { OrganizationSwitcher, SignedIn, SignOutButton } from "@clerk/nextjs";

function TopBar() {
    return (
      <nav className="topbar">
        <Link href="/" className="flex items-center gap-4">
          EzReality
        </Link>
        
        <div className="flex item-center gap-1">
          <div className="block md:hidden">
            <SignedIn>
              <SignOutButton>
                <div className="flex cursor-pointer">
                  <Image
                    src="/assets/logout.svg"
                    alt="logout"
                    width={24}
                    height={24}
                  />
                </div>
              </SignOutButton>
            </SignedIn>
          </div>

          <OrganizationSwitcher
            appearance={{
              elements: {
                organizationSwitcherTrigger:
                "py-2 px-4"
              }
            }}
          />
        </div>

      </nav>
    )
  }
  
  export default TopBar;