import axios from "axios";

import { User } from "../../models/user";
import Merchant from "../../models/merchant";

const paystack = axios.create({
  baseURL: "https://api.paystack.co",
  headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
});