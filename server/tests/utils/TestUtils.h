//
// Created by nikita on 11/26/24.
//

#ifndef TESTUTILS_H
#define TESTUTILS_H

#include <iostream>
#include <vector>
#include <fstream>
#include <filesystem>

using namespace std;

class TestUtils {
public:
    static const vector<pair<vector<string>, string>> testData;
     static vector<string> readFileLines(const string& filePath);
    static const vector<pair<vector<string>, string>> modifiedData;
};



#endif //TESTUTILS_H
