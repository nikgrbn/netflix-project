#include <HelloWorldCommand.h>
#include <LocalDataManager.h>
#include <gtest/gtest.h>
#include <vector>
#include "../inc/AddCommand.h"
#include "TestVars.cpp"

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

  // Run through each test case in the vector
  for (const auto& testCase : TestVars::testData) {
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

