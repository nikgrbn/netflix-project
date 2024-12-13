//
// Created by nikita on 11/26/24.
//

#include "TestUtils.h"
#include <gtest/gtest.h>
#include <iostream>
#include <fstream>
#include <filesystem>
#include <iostream>

std::vector<std::string> TestUtils::readFileLines(const std::string& filePath) {
    std::vector<std::string> lines;
    std::ifstream file(filePath);
    std::string line;
    while (std::getline(file, line)) {
        lines.push_back(line);
    }
    return lines;
}

const TestUtils& TestUtils::getInstance(){
    static TestUtils instance;
    return instance;
}

TestUtils::TestUtils() : testData(), testPreparation() {
    testPreparation["POST"] = "";
    testData["POST"] = {
        {{"POST", "1", "100", "101", "102", "103"}, "1 100 101 102 103"},
        {{"POST", "2", "101", "102", "104", "105", "106"}, "2 101 102 104 105 106"},
        {{"POST", "3", "100", "104", "105", "107", "108"}, "3 100 104 105 107 108"},
        {{"POST", "4", "100", "105", "106", "107", "109", "110"}, "4 100 105 106 107 109 110"},
        {{"POST", "5", "100", "102", "103", "105", "108", "111"}, "5 100 102 103 105 108 111"},
        {{"POST", "6", "100", "103", "104", "110", "111", "112", "113"}, "6 100 103 104 110 111 112 113"},
        {{"POST", "7", "102", "105", "106", "107", "108", "109", "110"}, "7 102 105 106 107 108 109 110"},
        {{"POST", "8", "101", "104", "105", "106", "109", "111", "114"}, "8 101 104 105 106 109 111 114"},
        {{"POST", "9", "100", "103", "105", "107", "112", "113", "115"}, "9 100 103 105 107 112 113 115"},
        {{"POST", "10", "100", "102", "105", "106", "107", "109", "110", "116"}, "10 100 102 105 106 107 109 110 116"}
    };

    testPreparation["GET"] = "1 100 101 102 103\n"
        "2 101 102 104 105 106\n"
        "3 100 104 105 107 108\n"
        "4 100 105 106 107 109 110\n"
        "5 100 102 103 105 108 111\n"
        "6 100 103 104 110 111 112 113\n"
        "7 102 105 106 107 108 109 110\n"
        "8 101 104 105 106 109 111 114\n"
        "9 100 103 105 107 112 113 115\n"
        "10 100 102 105 106 107 109 110 116\n";
    testData["GET"] = {};

    testPreparation["PATCH"] = testPreparation["GET"];
    testData["PATCH"] = {
        {{"PATCH", "1", "104"}, "1 100 101 102 103 104"},
        {{"PATCH", "2", "103", "106"}, "2 101 102 104 105 106 103"},
        {{"PATCH", "3", "102", "105", "107"}, "3 100 104 105 107 108 102"},
        {{"PATCH", "4", "101", "103", "106", "108"}, "4 100 105 106 107 109 110 101 103 108"},
        {{"PATCH", "5", "100", "104", "106", "109", "111"}, "5 100 102 103 105 108 111 104 106 109"},
        {{"PATCH", "6", "100", "105", "107", "110", "112", "113"}, "6 100 103 104 110 111 112 113 105 107"},
        {{"PATCH", "7", "100", "102", "104", "106", "108", "109", "110"}, "7 102 105 106 107 108 109 110 100 104"},
        {{"PATCH", "8", "100", "103", "105", "107", "109", "111", "114"}, "8 101 104 105 106 109 111 114 100 103 107"},
        {{"PATCH", "9", "100", "102", "105", "106", "107", "109", "110", "115"}, "9 100 103 105 107 112 113 115 102 106 109 110"},
        {{"PATCH", "10", "100", "102", "103", "105", "106", "107", "108", "109", "110", "116"}, "10 100 102 105 106 107 109 110 116 103 108"}
    };
}

TestUtils::TestData TestUtils::getTestData(const std::string& testName) const {
    if (testData.find(testName) == testData.end()) {
        throw std::invalid_argument("Test name not found");
    }
    return testData.at(testName);
}

const void TestUtils::prepareTest(const std::string& testName, const std::string& fileName) const {
    if (testPreparation.find(testName) == testPreparation.end()) {
        std::ofstream clearFile(fileName, std::ios::trunc);
        clearFile.close();
        return;
    }

    std::ofstream file(fileName, std::ios::trunc);

    std::string toWrite = testPreparation.at(testName);
    file << toWrite;

    file.close();

    return;
}
