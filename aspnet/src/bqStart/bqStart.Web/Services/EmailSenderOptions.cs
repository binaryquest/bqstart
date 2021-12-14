using System;

namespace bqStart.Web
{
    public class EmailSenderOptions
    {
        public EmailSenderOptions()
        {
        }

        public string Host { get; set; } = String.Empty;

        public int Port { get; set; }

        public string Username { get; set; } = String.Empty;

        public string Password { get; set; } = String.Empty;

        public bool SSL { get; set; }

        public string SenderEmail { get; set; } = String.Empty;

        public string SenderName { get; set; } = String.Empty;
    }
}
