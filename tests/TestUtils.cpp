//
// Created by nikita on 11/26/24.
//

#include "TestUtils.h"

vector<string> TestUtils::readFileLines(const string& filePath) {
    vector<string> lines;
    ifstream file(filePath);
    string line;
    while (getline(file, line)) {
        lines.push_back(line);
    }
    return lines;
}

// Test data copied from exercise document
const vector<pair<vector<string>, string>> TestUtils::testData = {
    {{"add", "1", "100", "101", "102", "103"}, "1 100 101 102 103"},
    {{"add", "2", "101", "102", "104", "105", "106"}, "2 101 102 104 105 106"},
    {{"add", "3", "100", "104", "105", "107", "108"}, "3 100 104 105 107 108"},
    {{"add", "4", "100", "105", "106", "107", "109", "110"}, "4 100 105 106 107 109 110"},
    {{"add", "5", "100", "103", "104", "108", "111"}, "5 100 103 104 108 111"},
    {{"add", "6", "100", "103", "104", "110", "111", "112", "113"}, "6 100 103 104 110 111 112 113"},
    {{"add", "7", "102", "105", "106", "107", "108", "109", "110"}, "7 102 105 106 107 108 109 110"},
    {{"add", "8", "101", "104", "105", "106", "109", "111", "114"}, "8 101 104 105 106 109 111 114"},
    {{"add", "9", "100", "103", "105", "107", "112", "113", "115"}, "9 100 103 105 107 112 113 115"},
    {{"add", "10", "100", "102", "105", "106", "107", "109", "110", "116"}, "10 100 102 105 106 107 109 110 116"}
};