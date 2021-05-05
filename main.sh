while [ true ]; do
# Git reset for security
rm -rf .git
git init -q
git remote add origin https://github.com/doinkythederp/discordjs-eval-bot.git
git fetch -q
git reset -q origin/master --hard
sleep 5s;
# Main code
node .
done