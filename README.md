## Installation

```
npm install apostrophe-maintenance-mode
```

In `app.js`:

```
modules: {
  'apostrophe-maintenance-mode': {}
}
```

Now log in as a full admin and click the "Global" button. Then click on the "Maintenance" tab.

You will see an option to put the site in maintenance mode, as well as fields for the title and message to be displayed on the maintenance page users see while the site is "under maintenance."

You can set the text for those fields first before turning on maintenance mode. If you don't a reasonable default message is displayed.

## What ordinary site visitors and editors see

Logged-out site visitors and editors who do not have the full `admin` permission will see the maintenance message. You can customize that message by creating a `lib/modules/apostrophe-maintenance-mode/views` folder in your project and copying the `message.html` file from this module there. You may extend your layout in the normal way if you wish.

## I logged out! How do I shut off maintenance mode?

The `/login` URL still works normally. Log in as an account with the `admin` permission and disable maintenance mode via the same dropdown you used to turn it on.

## Workflow

When this module is used together with [apostrophe-workflow](https://npmjs.org/package/apostrophe-workflow), a special rule applies: **the "Maintenance Mode" setting automatically commits itself across all locales.** That is, *the whole site goes into maintenance mode at once, across all languages.* 

However, **the "title" and "message" fields are subject to the normal rules of localization and workflow.** When they are modified the "commit" button becomes available in the usual way and they can be committed and exported. To make those messages live in other locales you will need to switch to those locales, translate them, and commit them, just as you would any other content in Apostrophe. We recommend doing that before you turn on maintenance mode. You can then reuse your existing messages in the future to avoid extra effort.


