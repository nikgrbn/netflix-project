#include "data_manager/LocalDataManager.h"
#include <gtest/gtest.h>
#include <vector>
#include "commands/AddCommand.h"
 #include "../utils/TestUtils.h"

using namespace std;

// Use add command to add data to the file and check it
TEST(AddCommandTest, CheckCorrectDataAddition) {
  string testFilePath = "data/users.txt";

  const TestUtils& testUtils = TestUtils::getInstance();
  // Ensure the test file is clean
  testUtils.prepareTest("POST", testFilePath);

  IDataManager* dataManager = new LocalDataManager();
  AddCommand addCommand(dataManager);

  // Run through each test case in the vector
  const auto& testData = testUtils.getTestData("POST");
  for (const auto& testCase : testData) {
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

// Check illegal arguments
TEST(AddCommandTest, CheckIllegalArguments) {
    IDataManager* dataManager = new LocalDataManager();
    AddCommand* m = new AddCommand(dataManager);

  // Zero arguments are illegal
  EXPECT_THROW(m->execute(vector<string>{}), StatusCodeException);

  // One argument is illegal
  EXPECT_THROW(m->execute(vector<string>{"POST"}), StatusCodeException);

  // Two arguments are also illegal
  EXPECT_THROW(m->execute(vector<string>{"POST 12"}), StatusCodeException);
}

// Check info method
TEST(AddCommandTest, CheckInfo) {
IDataManager* dataManager = new LocalDataManager();
  EXPECT_EQ(AddCommand(dataManager).info(), "POST, arguments: [userid] [movieid1] [movieid2] …");
}


