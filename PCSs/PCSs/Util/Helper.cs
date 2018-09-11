using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Security.Cryptography;
using System.Text;

namespace PCSs.Util
{
    public class Helper
    {
        public static string GetSecurityStamp()
        {
            return getSecurityStamp(255).ToString();
        }

        private static byte[] getSecurityStamp(int maxLen)
        {
            var salt = new byte[maxLen];
            using (var random = new RNGCryptoServiceProvider())
            {
                random.GetNonZeroBytes(salt);
            }
            return salt;
        }

        public static string Get_HASH_SHA512(string password, string username, byte[] salt)
        {
            try
            {
                //required NameSpace: using System.Text;
                //Plain Text in Byte
                byte[] plainTextBytes = Encoding.UTF8.GetBytes(password + username);

                //Plain Text + SALT Key in Byte
                byte[] plainTextWithSaltBytes = new byte[plainTextBytes.Length + salt.Length];

                for (int i = 0; i < plainTextBytes.Length; i++)
                {
                    plainTextWithSaltBytes[i] = plainTextBytes[i];
                }

                for (int i = 0; i < salt.Length; i++)
                {
                    plainTextWithSaltBytes[plainTextBytes.Length + i] = salt[i];
                }

                HashAlgorithm hash = new SHA512Managed();
                byte[] hashBytes = hash.ComputeHash(plainTextWithSaltBytes);
                byte[] hashWithSaltBytes = new byte[hashBytes.Length + salt.Length];

                for (int i = 0; i < hashBytes.Length; i++)
                {
                    hashWithSaltBytes[i] = hashBytes[i];
                }

                for (int i = 0; i < salt.Length; i++)
                {
                    hashWithSaltBytes[hashBytes.Length + i] = salt[i];
                }

                return Convert.ToBase64String(hashWithSaltBytes);
            }
            catch
            {
                return string.Empty;
            }
        }

        public static string getRandomAlphaNumeric(int len)
        {
            Random rand = new Random();
            string pool = "abcdefghijklmnopqrstuvwyxzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var chars = Enumerable.Range(0, len).Select(x => pool[rand.Next(0, pool.Length - 1)]);
            return new string(chars.ToArray());
        }
        public static string createMD5Hash(string password, string username, string salt)
        {
            using (MD5 md5 = MD5.Create())
            {
                byte[] hash_bytes = md5.ComputeHash(UTF8Encoding.UTF8.GetBytes(password + username + salt));
                //convert the byte array to hexadecimal string
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < hash_bytes.Length; ++i)
                {
                    sb.Append(hash_bytes[i].ToString("X2"));
                }
                return sb.ToString();
            }
        }

        public static bool CompareMD5HashValue(string password, string username, string salt, string oldHashValue)
        {
            try
            {
                string expectedHashString = createMD5Hash(password, username, salt);
                return (oldHashValue == expectedHashString);
            }
            catch 
            {
                return false;
            }
        }
    }
}