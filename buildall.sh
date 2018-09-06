#!/bin/bash
npm run build;
npm run test;
npm run release;
rm -rf calculation.zip calculation-dev.zip calculation-test.zip
zip -r calculation-dev.zip calculation-dev;
zip -r calculation-test.zip calculation-test;
zip -r calculation.zip calculation;

/usr/bin/expect <<-EOF
set timeout 180

spawn scp ./calculation.zip ./calculation-dev.zip ./calculation-test.zip root@192.168.2.200:/usr/local/webserver/nginx/html/cheku_yd
expect "*password:" {send "rx654321\r"}
expect "100%"
expect eof

EOF

/usr/bin/expect <<-EOF
set timeout 180

spawn ssh root@192.168.2.200
expect "*password:" {send "rx654321\r"}
expect "*#*" { send "cd /usr/local/webserver/nginx/html/cheku_yd\r" }
expect "*#*" { send "rm -rf calculation/ calculation-dev/ calculation-test/\r" }
expect "*#*" { send "unzip -q calculation.zip && unzip -q calculation-dev.zip && unzip -q calculation-test.zip\r" }
expect "*#*" { send "rm -rf calculation.zip calculation-dev.zip calculation-test.zip\r" }
expect "*#*" { send "exit\r" }

EOF

# /usr/bin/expect <<-EOF

# set timeout 1200

# spawn ssh root@192.168.2.200
# expect {
# "yes/no" { send "yes\r"; exp_continue}
# "password:" { send "rx654321\r" }
# }
# expect "*#" {send "cd /Users/renxin/source/shell/\r"}
# expect "*#" {send "sh deploy-calculation.sh > ./logs/deploy_calculation.log 2>&1 &\r"}
# expect "*#" {send "exit\r"}
# expect eof

# EOF
