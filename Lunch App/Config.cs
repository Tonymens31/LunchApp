namespace Lunch_App
{
    public class Config
    {
        public static Config Current;
        public Config()
        {
            Current = this;
        }

        public string LunchAppUrl { get; set; }

    }
}
