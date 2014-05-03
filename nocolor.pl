#!/usr/bin/env perl

# catch the output of some command
my $output = `make test`;

# remove only color codes
$output =~ s/\e\[[\d;]*m//g;

# or remove all ANSI escape sequences
# $output =~ s/\e\[?.*?[\@-~]//g

print "$output","\n";

