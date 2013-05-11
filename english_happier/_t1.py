#!/usr/bin/python

import os
import time

source = ['./data']

target_file = './data_bak' + time.strftime('%H%M%S') + '.zip'

command = "cp " + source[0] + ' ' + target_file

if os.system(command) == 0:
	print "Successful backup to", target_file
else:
	print "Backup FAILED!"
