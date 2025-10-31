export function buildPublicationApprovedNotification(
  name: string,
  title: string
) {
  return `
  <div
    dir="ltr"
    style="text-align:left; line-height:1.5;"
  >
    <p style="margin:0 0 1em;">Hello ${name},</p>

    <p style="margin:0 0 1em;">Great news! Your publication <strong>${title}</strong> is now live on our platform."</p>

    <p style="margin:0 0 1em;"><strong>What’s next?</strong></p>

    <ul
      style="
        margin:0 0 1em;
        padding-left:1.2em;
        list-style-type:disc;
        list-style-position:inside;
      "
    >
      <li style="margin:0 0 0.5em;">Share your publication on social media to increase visibility.</li>
      <li style="margin:0 0 0.5em;">Monitor your vendor dashboard for performance metrics.</li>
      <li style="margin:0 0 0.5em;">Consider adding more publications to expand your portfolio.</li>
    </ul>

    <p style="margin:0 0 1em;">If you have any questions, please don't hesitate to reach out to us through the contact page.</p>

    <p style="margin:0 0 1em;">Thank you for being a valued vendor!<br/>The Saerv Team</p>
  </div>
  `;
}

export function buildPromoteSuccessNotification(name: string, title: string) {
  return `
  <div
    dir="ltr"
    style="text-align:left; line-height:1.5;"
  >
    <p style="margin:0 0 1em;">Hello ${name},</p>

    <p style="margin:0 0 1em;">Congratulations, You're now promoting <strong>${title}</strong></p>

    <p style="margin:0 0 1em;"><strong>What’s next?</strong></p>

    <ul
      style="
        margin:0 0 1em;
        padding-left:1.2em;
        list-style-type:disc;
        list-style-position:inside;
      "
    >
      <li style="margin:0 0 0.5em;">Share your affiliate link and cover image to increase visibility.</li>
      <li style="margin:0 0 0.5em;">Monitor your affiliate dashboard for performance metrics.</li>
      <li style="margin:0 0 0.5em;">Consider promoting more publications to expand your portfolio.</li>
    </ul>

    <p style="margin:0 0 1em;">If you have any questions, please don't hesitate to reach out to us through the contact page.</p>

    <p style="margin:0 0 1em;">Thank you for being an affiliate!<br/>The Saerv Team</p>
  </div>
  `;
}
