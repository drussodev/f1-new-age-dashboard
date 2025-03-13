
/**
 * Webhook utility to send notifications about admin actions
 */

// Discord webhook URL
const DISCORD_WEBHOOK_URL = "https://discordapp.com/api/webhooks/1349861432283365527/s641YJcbGI70D5ByulBK8xOUFnHYTyEIjCpNtpRsEisJWP4e_7TwQs_7gxuyq8w4e5Lv";

/**
 * Sends a notification to the webhook
 */
export const sendWebhookNotification = async (
  action: string,
  username: string,
  details: Record<string, any>
) => {
  try {
    const timestamp = new Date().toISOString();
    
    const payload = {
      content: null,
      embeds: [
        {
          title: `Admin Action: ${action}`,
          description: `User **${username}** performed an admin action`,
          color: 15258703, // F1 red color in decimal
          fields: Object.entries(details).map(([name, value]) => ({
            name,
            value: String(value).substring(0, 1024), // Discord limits field values to 1024 chars
            inline: true,
          })),
          footer: {
            text: "F1 New Age Admin Panel"
          },
          timestamp
        }
      ]
    };

    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error("Failed to send webhook notification:", await response.text());
    }
  } catch (error) {
    console.error("Error sending webhook notification:", error);
  }
};
