type subscriptionSuccessProps = {
  name: string;
  plan: string;
  features: {
    a: string;
    b: string;
    c: string;
    d: string;
    e: string;
  };
};

export function buildSubscriptionSuccessfulNotification({
  name,
  plan,
  features,
}: subscriptionSuccessProps) {
  return `
  <div
    dir="ltr"
    style="text-align:left; line-height:1.5;"
  >
    <p style="margin:0 0 1em;">Hello ${name},</p>

    <p style="margin:0 0 1em;">We are pleased to confirm your successful subscription to the <strong>${plan}</strong> plan!"</p>

    <p style="margin:0 0 1em;">The plan’s features includes:</p>

    <ul
      style="
        margin:0 0 1em;
        padding-left:1.2em;
        list-style-type:disc;
        list-style-position:inside;
      "
    >
      <li style="margin:0 0 0.5em;">${features.a}</li>
      <li style="margin:0 0 0.5em;">${features.b}</li>
      <li style="margin:0 0 0.5em;">Minimum withdrawal amount of ${features.c}</li>
      <li style="margin:0 0 0.5em;">Platform withdrawal fee of ${features.d}</li>
      <li style="margin:0 0 0.5em;">${features.e}</li>
    </ul>

    <p style="margin:0 0 1em;">If you have any questions, please don't hesitate to reach out to us through the contact page.</p>

    <p style="margin:0 0 1em;">Thank you for being a valued merchant!<br/>The Saerv Team</p>
  </div>
  `;
}
