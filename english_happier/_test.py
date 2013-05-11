#!/usr/bin/python

import webbrowser

url = "www.iciba.com/hello"

webbrowser.open(url, new=1)
webbrowser.open_new(url)
webbrowser.open_new_tab(url)

ctlr = webbrowser.get()

#aaabb.bb.cc()
