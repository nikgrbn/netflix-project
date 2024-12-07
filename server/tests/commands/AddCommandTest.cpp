#include "data_manager/LocalDataManager.h"
#include <gtest/gtest.h>
#include <vector>
#include "commands/AddCommand.h"
 #include "../utils/TestUtils.h"

using namespace std;

IDataManager* dataManager = new LocalDataManager();

// Use add command to add data to the file and check it
TEST(AddCommandTest, CheckCorrectDataAddition) {
  string testFilePath = "data/users.txt";
  AddCommand addCommand(dataManager);

  // Ensure the test file is clean
  ofstream clearFile(testFilePath, ofstream::trunc); // Clear the file
  clearFile.close();

  // Run through each test case in the vector
  for (const auto& testCase : TestUtils::testData) {
    const vector<string>& command = testCase.first;
    const string& expectedLine = testCase.second;

    // Act
    addCommand.execute(command);

    // Assert
    vector<string> fileLines = TestUtils::readFileLines(testFilePath);     // Read file
    auto it = find(fileLines.begin(), fileLines.end(), expectedLine);
    EXPECT_NE(it, fileLines.end());
  }
}

// Test adding a user that already exists and updating it movie list
TEST(AddCommandTest, CheckAddOnExistingUser) {
  string testFilePath = "data/users.txt";
  AddCommand addCommand(dataManager);

  // Ensure the test file is clean
  ofstream clearFile(testFilePath, ofstream::trunc); // Clear the file
  clearFile.close();

  vector<string> command1 = {"POST", "10", "1", "1", "1", "1"};
  string expectedLine1 = "10 1";

  addCommand.execute(command1); // Add user

  // Assert user been added correctly
  vector<string> fileLines = TestUtils::readFileLines(testFilePath);     // Read file
  auto it = find(fileLines.begin(), fileLines.end(), expectedLine1);
  EXPECT_EQ(*it, expectedLine1);

  // Add more movies to the user
  vector<string> command2 = {"POST", "10", "1", "10", "12", "2"};
  string expectedLine2 = "10 1 10 12 2";

  addCommand.execute(command2); // Add user

  // Assert user been added correctly
  fileLines = TestUtils::readFileLines(testFilePath);     // Read file
  it = find(fileLines.begin(), fileLines.end(), expectedLine2);
  EXPECT_EQ(*it, expectedLine2);
}

// Check illegal arguments
TEST(AddCommandTest, CheckIllegalArguments) {
  AddCommand* m = new AddCommand(dataManager);

  // Zero arguments are illegal
  EXPECT_THROW(m->execute(vector<string>{}), std::invalid_argument);

  // One argument is illegal
  EXPECT_THROW(m->execute(vector<string>{"POST"}), std::invalid_argument);

  // Two arguments are also illegal
  EXPECT_THROW(m->execute(vector<string>{"POST 12"}), std::invalid_argument);
}

// Check info method
TEST(AddCommandTest, CheckInfo) {
  EXPECT_EQ(AddCommand(dataManager).info(), "POST, arguments: [userid] [movieid1] [movieid2] …");
}


