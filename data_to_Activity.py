import csv
import sys
import datetime 
datelist = []
value = []
f = open("rescuetime-sep15-sanitized.csv" , "rt")
try:
	reader = csv.reader(f)
	for row in reader:
		datelist.append(str(row[0]+","+row[1])+","+row[3])
finally:
	f.close()

f = open("profcsv.csv","w")
try:
        string_line = str(str("Day")+","+str("Hour")+","+str("Activity")+","+str("Timespent")+","+str("Month"))
        f.write(string_line + "\n")
	firstlist = []
	datelist = datelist[1:]
	string_val = ""
	check = len(datelist)
	print check
	count = 1
	sum_value = 0
	current_time  = None
	next_time = None
	current_ac = None
	next_ac = None
	activity_string = ""
	for index, item in enumerate(datelist):
		if(count < check):
			

			current_time = item.split(",")[0]
			print "current_time:" + str(current_time)
			print count
			next_time  = datelist[index + 1].split(",")[0]
			current_spent = item.split(",")[1]
			next_spent = datelist[index + 1].split(",")[1]

			
			if((current_time == next_time )):

				
				# print datelist[index + 1].split(",")[1]
				sum_value =sum_value + int(item.split(",")[1])
				# print sum_value
				# datelist[index + 1].split(",")[1] = sum_value 
				activity_string =str(item.split(",")[2]+"="+current_spent+","+activity_string)
				# print activity_string
				# print "******************"	

			else:	
				# sum_value = sum_value+ int (datelist[index - 1].split(",")[1])
				
				activity_string = activity_string +  str(datelist[index + 1].split(",")[2]+"="+current_spent)
				current_time  = (datetime.datetime.strptime(current_time, "%Y-%m-%dT%H:%M:%S"))
				string_val  = str(str(current_time.day) + "|" + str(current_time.hour) + "|" + str(activity_string)+ "|" + str(current_time.month))
				print string_val
				firstlist.append(string_val)
				# print stri ng_val
				# sum_value = 0
				activity_string = ""
			count = count + 1
	activity_string = activity_string +  str(datelist[index].split(",")[2]+"="+current_spent)
	current_time  = (datetime.datetime.strptime(current_time, "%Y-%m-%dT%H:%M:%S"))
	string_val  = str(str(current_time.day) + "|" + str(current_time.hour) + "|" + str(activity_string)+ "|" + str(current_time.month))
	print string_val
	firstlist.append(string_val)
			
			
		

	activity_sum = 0
	string_val = ""
	check = len(firstlist)
	count = 1
	for chick in firstlist:
		print chick

	for index, item in enumerate(firstlist):
		# print item
		item = item.split("|")
		# activity_set = item[2]
		# activity_set = activity_set.split(",")
		
		ac_list= item[2].split(",")
		ac_list.sort();
		print ac_list
		# del ac_list[0]
		ac_acount = 1
		ac_length = len(ac_list)

		for dex,duck in enumerate(ac_list):
			if(ac_acount<ac_length):
				# print duck
				current_ac = duck.split("=")[0]
				# print current_ac
				next_ac = ac_list[dex + 1].split("=")[0]
				# print next_ac
				if(current_ac == next_ac):
					activity_sum = activity_sum + int(duck.split("=")[1])
					# print activity_sum
				else: 
					activity_sum  = activity_sum + int(ac_list[dex].split("=")[1])
					string_val = str(str(item[0])+","+str(item[1])+","+str(current_ac)+","+str(activity_sum)+","+str(item[3]))
					print string_val
					f.write(string_val+"\n")
					string_val = ""
					activity_sum = 0
			ac_acount = ac_acount + 1
				
		activity_sum = activity_sum + int(ac_list[dex].split("=")[1])
		string_val = str(str(item[0])+","+str(item[1])+","+str(next_ac)+","+str(activity_sum)+","+str(item[3]))
		f.write(string_val + "\n")
		activity_sum = 0	
	count = count + 1

finally:
	f.close()
