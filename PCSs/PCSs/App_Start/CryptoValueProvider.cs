using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PCSs
{
    public class CryptoValueProvider : IValueProvider
    {
        public bool ContainsPrefix(string prefix)
        {
            throw new NotImplementedException();
        }

        public ValueProviderResult GetValue(string key)
        {
            throw new NotImplementedException();
        }
    }

    public class CryptoValueProfiderFactory : ValueProviderFactory
    {
        public override IValueProvider GetValueProvider(ControllerContext controllerContext)
        {
            return new CryptoValueProvider();
        }
    }

    public class Crypto
    {
      public static string Encode(string encodeMe)
        {
            byte[] encoded = System.Text.ASCIIEncoding.UTF8.GetBytes(encodeMe);
            return Convert.ToBase64String(encoded);
        }

        public static string Decode(string decodeMe)
        {
            byte[] encoded = Convert.FromBase64String(decodeMe);
            return System.Text.ASCIIEncoding.UTF8.GetString(encoded);
        }

        public static Dictionary<string, string> Decrypt(string encryptedText)
        {
            Dictionary<string, string> dic = new Dictionary<string, string>();
            dic.Add(encryptedText, Encode(encryptedText));
            return dic;
        }
    }
}