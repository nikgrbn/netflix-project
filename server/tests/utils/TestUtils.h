#ifndef TESTUTILS_H
#define TESTUTILS_H

#include <string>
#include <vector>
#include <map>
#include <unordered_map>
#include <iostream>
#include <fstream>
#include "../inc/utils/Config.h"

class TestUtils {
public:
    static std::vector<std::string> readFileLines(const std::string& filePath=Config::getUserFilePath());
    typedef std::pair<std::vector<std::string>, std::string> TestLine;
    typedef std::vector<TestLine> TestData;

private:
    std::unordered_map<std::string, TestData> testData;
    std::unordered_map<std::string, std::string> testPreparation;

    TestUtils();
public:
    // Copy constructor.
    TestUtils(const TestUtils& other) = delete;
    // Move constructor.
    TestUtils(TestUtils&& other) = delete;
    
    // Copy assignment operator.
    void operator=(const TestUtils& other) = delete;
    // Move assignment operator.
    void operator=(TestUtils&& other) = delete;

    TestData getTestData(const std::string& testName) const;
    const void prepareTest(const std::string& testName, const std::string& fileName=Config::getUserFilePath()) const;

    static const TestUtils& getInstance();
};

#endif //TESTUTILS_H
