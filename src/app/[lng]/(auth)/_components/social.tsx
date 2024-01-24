import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { loginActionWithSocial } from "@/actions/login";
const Social = () => {
  return (
    <div className="flex items-center w-full gap-x-2">
      <form
      className="w-full"
        action={() => {
          loginActionWithSocial("google");
        }}
      >
        <Button size="lg" variant="outline" className="w-full">
          <FcGoogle className="h-5 w-5" />
        </Button>
      </form>
      <form
      className="w-full"
        action={() => {
          loginActionWithSocial("github");
        }}
      >
        <Button size="lg" variant="outline" className="w-full">
          <FaGithub className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};

export default Social;
