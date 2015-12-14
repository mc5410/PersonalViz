import csv
import sys
import datetime 
datelist = []
value = []
f = open("mymonthdata.csv" , "rt")
try:
	reader = csv.reader(f)
	for row in reader:
		datelist.append(str(row[0]))
finally:
	f.close()

f = open("ashatsvfile.tsv","w")
try:
	datelist = datelist[1:]
	string_val = ""
	check = len(datelist)
	print check
	count = 1
	sum_value = 0
	current  = None
	next = None
	frequency = 1
	for index, item in enumerate(datelist):
		if(count < check):
			print "******************"
			print count
			print check
			current = item
			print "current:" + str(current)
			next = datelist[index + 1]
			print "next:" +  str(next)
			
			if(current == next):
				frequency = frequency + 1 
				# sum_value =sum_value + int(item.split(",")[1])
			
				# datelist[index + 1].split(",")[1] = sum_value 
				print "******************"				
			else:	
				# sum_value = sum_value+ int (datelist[index - 1].split(",")[1])
				
				current  = (datetime.datetime.strptime(current, "%Y-%m-%dT%H:%M:%S"))
				string_val  = str(str (current.month) + "\t" + str(current.day) + "\t" + str(current.hour) + "\t" + str(frequency))
				f.write(string_val+"\n")
				print string_val
				frequency = 1
				# sum_value = 0
			count = count + 1 
	current = (datetime.datetime.strptime(current, "%Y-%m-%dT%H:%M:%S"))
	string_val  = str(str (current.month) + "\t" + str(current.day) + "\t" + str(current.hour+1) + "\t" + str(frequency))
	f.write(string_val+"\n")
	print string_val
finally:

	f.close()
