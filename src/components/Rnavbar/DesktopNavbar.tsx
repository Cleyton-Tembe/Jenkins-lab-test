import { currentUser } from "@clerk/nextjs/server"
import { ModeToggle } from "../button/ToggleMode"
import { Button } from "../ui/button"
import Link from "next/link"
import { BellIcon, HomeIcon, UserIcon } from "lucide-react"
import { Show, SignInButton, UserButton } from "@clerk/nextjs"


const DesktopNavbar = async () => {

  const cuser = await currentUser()


  return (
    <div className="hidden md:flex items-center space-x-4">
      <ModeToggle />

      <Button variant="ghost" className="flex items-center gap-2" asChild>
        <Link href="/">
          <HomeIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      {cuser ? (
        <>
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link href="/notification">
              <BellIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Notifications</span>
            </Link>
          </Button>

          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link
              href={`/profile/${
                cuser.username ??
                cuser.emailAddresses[0].emailAddress.split("@")[0]
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Profile</span>
            </Link>
          </Button>

          <Show when="signed-in">
            <UserButton />
          </Show>
        </>
      ) : (
        <SignInButton mode="modal">
          <Button variant="default">Sign In</Button>
        </SignInButton>
      )}
    </div>
  );
}

export default DesktopNavbar