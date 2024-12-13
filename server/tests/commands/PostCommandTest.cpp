#include <gtest/gtest.h>
#include <vector>

#include "data_manager/LocalDataManager.h"
#include "commands/PostCommand.h"
#include "../utils/TestUtils.h"

using namespace std;

TEST(PostCommandTest, CheckCorrectDataAddition) {
  const TestUtils& testUtils = TestUtils::getInstance();
  // Require the test file be filled with data.
  string testFilePath = "data/users.txt";
  testUtils.prepareTest("POST", testFilePath);

  IDataManager* dataManager = new LocalDataManager();
  PostCommand postCommand(dataManager);

  // Run through each test case in the vector
  const auto& testData = testUtils.getTestData("POST");
  for (const auto& testCase : testData) {
    const vector<string>& command = testCase.first;
    const string& expectedLine = testCase.second;

    // Act
    postCommand.execute(command);

    // Assert
    vector<string> fileLines = TestUtils::readFileLines(testFilePath);     // Read file
    auto it = find(fileLines.begin(), fileLines.end(), expectedLine);
    EXPECT_NE(it, fileLines.end()) << "Failed searching for " << expectedLine;
  }
}

TEST(PostCommandTest, CheckIllegalArguments) {
  IDataManager* dataManager = new LocalDataManager();
  PostCommand* postCommand = new PostCommand(dataManager);

  EXPECT_THROW(postCommand->execute(vector<string>{}), StatusCodeException);

  EXPECT_THROW(postCommand->execute(vector<string>{"POST"}), StatusCodeException);

  EXPECT_THROW(postCommand->execute(vector<string>{"POST 12"}), StatusCodeException);
}

TEST(PostCommandTest, CheckInfo) {
  IDataManager* dataManager = new LocalDataManager();
  EXPECT_EQ(PostCommand(dataManager).info(), "POST [userid] [movieid1] [movieid2] ...");
}
