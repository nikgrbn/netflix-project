#include <gtest/gtest.h>
#include "../inc/RecommendCommand.h"
#include "../inc/LocalDataManager.h"
#include "TestUtils.h"

TEST(RecommendCommandTest, CheckCorrectRecommendations) {
    IDataManager* dataManager = new LocalDataManager();
    RecommendCommand cRecommend(dataManager);

    // Ensure the test file is clean and ready for writing
    string testFilePath = "data/users.txt";
    ofstream outFile(testFilePath, ofstream::trunc); // Open in trunc mode to clear content

    for (const auto& dataLine : TestUtils::testData) {
        outFile << dataLine.second << endl; // Write data to a file
    }
    outFile.close();

    // Expected recommendations for user 1 and movie 104
    vector<string> command = {"recommend", "1", "104"};
    string expectedLine = "105 106 111 110 112 113 107 108 109 114";

    cRecommend.execute(command);

    // Read the file and check if the expected line is present
    vector<string> fileLines = TestUtils::readFileLines(testFilePath);
    auto it = find(fileLines.begin(), fileLines.end(), expectedLine);
    EXPECT_EQ(*it, expectedLine);
}

// Check illegal arguments
TEST(RecommendCommandTest, CheckIllegalArguments) {
    IDataManager* dataManager = new LocalDataManager();
    RecommendCommand* m = new RecommendCommand(dataManager);

    // Zero arguments are illegal
    EXPECT_THROW(m->execute(vector<string>{}), std::invalid_argument);

    // One argument is illegal
    EXPECT_THROW(m->execute(vector<string>{"recommend"}), std::invalid_argument);

    // Two arguments are also illegal
    EXPECT_THROW(m->execute(vector<string>{"recommend 1"}), std::invalid_argument);
}

// Check info method
TEST(RecommendCommandTest, CheckInfo) {
    IDataManager* dataManager = new LocalDataManager();
    EXPECT_EQ(RecommendCommand(dataManager).info(), "recommend [userid] [movieid]");
}