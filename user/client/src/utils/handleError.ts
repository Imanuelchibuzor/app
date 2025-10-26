import { AxiosError } from "axios";
import { toast } from "sonner";

const handleError = (err: unknown) => {
  let message = "Something went wrong. Please try again.";
  if (err instanceof AxiosError && err.response) {
    message = err.response.data.message || err.response.data.errors;
  }
  toast.error(message);
};

export default handleError;