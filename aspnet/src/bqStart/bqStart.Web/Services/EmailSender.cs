using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace bqStart.Web
{
    public class EmailSender : IEmailSender
    {
        private readonly ILogger<EmailSender> logger;

        public EmailSender(IOptions<EmailSenderOptions> options, ILogger<EmailSender> logger)
        {
            this.Options = options.Value;
            this.logger = logger;
        }

        public EmailSenderOptions Options { get; set; } = null!;

        public Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            try
            {
                SmtpClient client = new()
                {
                    Port = Options.Port,
                    Host = Options.Host!,
                    EnableSsl = Options.SSL,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                    Credentials = new NetworkCredential(Options.Username, Options.Password)
                };

                MailMessage message = new()
                {
                    Subject = subject,
                    Body = htmlMessage,
                    From = new MailAddress($"{Options.SenderName} <{Options.SenderEmail}>")
                };
                message.To.Add(email);
                message.IsBodyHtml = true;

                return client.SendMailAsync(message);
            }
            catch (Exception ex)
            {
                logger.LogError("{ex}",ex);
                throw;
            }
            
        }
    }
}
