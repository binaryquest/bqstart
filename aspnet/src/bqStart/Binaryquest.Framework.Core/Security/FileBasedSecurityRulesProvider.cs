using BinaryQuest.Framework.Core.Interface;
using BinaryQuest.Framework.Core.Model;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.Security
{
    public class FileBasedSecurityRulesProvider : ISecurityRulesProvider
    {
        private readonly string path;

        public FileBasedSecurityRulesProvider(string path)
        {
            this.path = path;
        }

        public List<SecurityRule> GetRules()
        {
            List<SecurityRule> ret = new List<SecurityRule>();
            string fullPath = Path.Combine(AppContext.BaseDirectory, path);
            string[] ruleFiles = Directory.GetFiles(fullPath, "*.config");
            if (ruleFiles.Length > 0)
            {
                for (int i = 0; i < ruleFiles.Length; i++)
                {
                    var data = File.ReadAllText(ruleFiles[i]);
                    var modViews = SecurityRules.Deserialize(data);
                    foreach (var rule in modViews.SecurityRule)
                    {
                        ret.Add(rule);
                    }
                }

            }
            return ret;
        }
    }
}
