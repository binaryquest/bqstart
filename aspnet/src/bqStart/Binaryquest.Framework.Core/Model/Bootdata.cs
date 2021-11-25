using BinaryQuest.Framework.Core.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BinaryQuest.Framework.Core.Model
{
    public class Bootdata
    {
        private readonly AppConfigOptions configOptions;

        public Bootdata(AppConfigOptions configOptions)
        {
            this.configOptions = configOptions;
            this.SecurityRulesDictionary = new Dictionary<string, Dictionary<string, SecurityRule>>();
            this.MetaDataValues = new Dictionary<Type, ModelMetadata>();
            if (configOptions.SecurityRulesProvider != null)
            {
                ParseRules(configOptions.SecurityRulesProvider);
            }
        }

        private void ParseRules(ISecurityRulesProvider securityRulesProvider)
        {
            var rules = securityRulesProvider.GetRules();
            foreach (var rule in rules)
            {

                if (!SecurityRulesDictionary.ContainsKey(rule.ModelType))
                {
                    SecurityRulesDictionary.Add(rule.ModelType, new Dictionary<string, SecurityRule>());
                }

                Dictionary<string, SecurityRule> perModelDic = SecurityRulesDictionary[rule.ModelType];

                if (!perModelDic.ContainsKey(rule.RoleName))
                {
                    perModelDic.Add(rule.RoleName, rule);
                }
                else
                {
                    //if already found then union merge with existing ones
                    var existingRule = perModelDic[rule.RoleName];
                    existingRule.AllowSelect = rule.AllowSelect;
                    existingRule.AllowInsert = rule.AllowInsert;
                    existingRule.AllowUpdate = rule.AllowUpdate;
                    existingRule.AllowDelete = rule.AllowDelete;
                }
            }
        }

        public Dictionary<Type, ModelMetadata> MetaDataValues { get; set; }
        public Dictionary<string, Dictionary<string, SecurityRule>> SecurityRulesDictionary { get; set; }
    }
}
