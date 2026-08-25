# Brief quiz — receiver setup

The quiz at `/{fr,en,ar}/brief` posts its answers to a Google Apps Script that
runs inside the DESORA Google account. That script owns the spreadsheet, the
Drive folder for uploaded logos and photos, and the notifications.

This arrangement exists for one reason: **no credential ever reaches the
browser.** The website only knows the deployment URL, which is a public
write-only endpoint exactly like an HTML form action. A Google service-account
key, by contrast, would have to be stored somewhere the site can read it.

Total setup time is about five minutes. Steps 1 to 3 are required; step 4 adds
WhatsApp and can be skipped, in which case every brief arrives by email instead.

---

## 1. Create the script

1. Open <https://script.google.com> and click **New project**.
2. Delete the placeholder `myFunction` code.
3. Paste the entire contents of `Code.gs` from this folder.
4. Rename the project to `DESORA briefs` (top left).

The spreadsheet ID is already filled in and points at:

```
https://docs.google.com/spreadsheets/d/1o7iWUti7i5Yftkqz8svVxi2i8DpVAAQbHSUoupRUbsY/edit
```

You do not need to create the header row. The script writes all 29 headers on
the first submission, freezes the row and styles it in crimson.

## 2. Authorise it

1. In the function dropdown choose **testSubmission**, then press **Run**.
2. Google will ask for permission, since the script touches Sheets, Drive and
   Gmail. Choose your account, click **Advanced**, then **Go to DESORA briefs
   (unsafe)**. This warning is normal for a script you wrote yourself and have
   not submitted for Google review.
3. Allow.

Now check the spreadsheet. A row called `Test DESORA` should be there, under a
crimson header row, and an email should have arrived at `desoragency@gmail.com`.
Delete the test row afterwards.

## 3. Deploy it and connect the site

1. **Deploy** → **New deployment**.
2. Type: **Web app**.
3. Execute as: **Me**.
4. Who has access: **Anyone**.
   This is required. It means anyone can POST a brief, exactly as anyone can
   submit a contact form. It does **not** give anyone access to your sheet,
   your Drive or your account.
5. Deploy, then copy the `/exec` URL.
6. Paste it into `quizEndpoint` in `src/lib/site-config.ts`:

```ts
quizEndpoint: 'https://script.google.com/macros/s/AKfy…/exec',
```

7. Commit and push. Cloudflare rebuilds and the quiz goes live.

> **Every time you edit `Code.gs`,** you must run **Deploy → Manage deployments
> → edit → Version: New version → Deploy.** Saving the file alone changes
> nothing on the live URL. This is the single most common reason a change
> appears to have no effect.

## 4. WhatsApp notifications (optional)

Apps Script cannot message WhatsApp on its own; that needs a provider.
CallMeBot is free and takes two minutes, but it only sends to a number that has
opted in once.

1. From **+212 702243374**, send this WhatsApp message to **+34 621 331 709**:

   ```
   I allow callmebot to send me messages
   ```

2. It replies with an API key.
3. Paste that key into `CONFIG.CALLMEBOT_APIKEY` in `Code.gs`.
4. Redeploy as a new version (see the warning above).

If you skip this, or the key is wrong, or CallMeBot is down, the script falls
back to emailing `desoragency@gmail.com`. `ALWAYS_EMAIL` is set to `true` by
default, so the email arrives on every submission regardless: WhatsApp is the
quick ping, the email carries the full brief.

### If you outgrow CallMeBot

It is a free hobby service with no delivery guarantee, which is fine for a
handful of briefs a week. If it becomes business-critical, replace
`sendWhatsApp_()` with Twilio's WhatsApp API or Meta's Cloud API. Only that one
function changes; nothing else in the pipeline cares.

---

## What lands where

| Thing | Destination |
|---|---|
| Answers | The spreadsheet, one row per brief, 29 columns |
| Logo and photos | Drive → `DESORA briefs` → `YYYY-MM-DD HHmm — Client name` |
| File links | Last column of the sheet, and the logo also gets its own column |
| Fast alert | WhatsApp to +212 702243374 |
| Full brief | Email to desoragency@gmail.com |

Uploads are capped at 8MB per file in the browser, since the quiz is mostly
answered on a phone over mobile data. Every file question also offers "I will
send it on WhatsApp", so nobody is blocked by a slow connection.

## Adding a question later

1. Add it to `quizSteps` in `src/lib/quiz.ts`, with all three translations.
2. Add its `id` and a column header to `COLUMNS` in `Code.gs`.
3. Redeploy the script as a new version.

Existing columns keep their position, so old rows stay readable.

## Troubleshooting

**The quiz shows "that did not send".**
Open the `/exec` URL directly in a browser. You should see
`{"ok":true,"service":"DESORA brief receiver"}`. If you get a Google sign-in
page instead, access is not set to **Anyone** — fix it in Manage deployments.

**Rows are not appearing.**
Check `SHEET_ID` matches the spreadsheet URL, and that the account running the
script can edit that sheet.

**Nothing changed after editing the script.**
You saved but did not deploy a new version. See the warning in step 3.
