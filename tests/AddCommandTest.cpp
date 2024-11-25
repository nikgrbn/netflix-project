#include <HelloWorldCommand.h>
#include <LocalDataManager.h>
#include <gtest/gtest.h>
#include <vector>
#include "../inc/AddCommand.h"

using namespace std;

IDataManager* dataManager = new LocalDataManager();

// Check illegal arguments
TEST(AddCommandTest, CheckIllegalArguments) {
  AddCommand* m = new AddCommand(dataManager);

  // Zero arguments are illegal
  EXPECT_THROW(m->execute(vector<string>{}), std::invalid_argument);

  // One argument is illegal
  EXPECT_THROW(m->execute(vector<string>{"add"}), std::invalid_argument);

  // Two arguments are also illegal
  EXPECT_THROW(m->execute(vector<string>{"add 12"}), std::invalid_argument);
}

// Check info method
TEST(AddCommandTest, CheckInfo) {
  EXPECT_EQ(AddCommand(dataManager).info(), "add [userid] [movieid1] [movieid2] …");
}

// Helper function to read the contents of a file line by line
vector<string> readFileLines(const string& filePath) {
  vector<string> lines;
  ifstream file(filePath);
  string line;
  while (getline(file, line)) {
    lines.push_back(line);
  }
  return lines;
}

TEST(AddCommandTest, CheckCorrectDataAddition) {
  string testFilePath = "data/users.txt";
  LocalDataManager dataManager;
  AddCommand addCommand(&dataManager);

  // Ensure the test file is clean
  ofstream clearFile(testFilePath, ofstream::trunc); // Clear the file
  clearFile.close();

  // Commands and expected lines
  vector<pair<vector<string>, string>> testCases = {
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

  // Run through each test case in the vector
  for (const auto& testCase : testCases) {
    const vector<string>& command = testCase.first;
    const string& expectedLine = testCase.second;

    // Act
    addCommand.execute(command);

    // Assert
    vector<string> fileLines = readFileLines(testFilePath);     // Read file
    auto it = find(fileLines.begin(), fileLines.end(), expectedLine);
    EXPECT_NE(it, fileLines.end());
  }
}

