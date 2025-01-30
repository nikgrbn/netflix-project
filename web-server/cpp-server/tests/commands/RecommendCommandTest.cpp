#include <gtest/gtest.h>
#include "commands/RecommendCommand.h"
#include "data_manager/LocalDataManager.h"
#include "../utils/TestUtils.h"

TEST(RecommendCommandTest, CheckCorrectRecommendations) {
    const TestUtils& testUtils = TestUtils::getInstance();
    // Ensure the test file is clean and ready for writing
    testUtils.prepareTest("GET");

    IDataManager* dataManager = new LocalDataManager();
    RecommendCommand cRecommend(dataManager);

    // Expected recommendations for user 1 and movie 104
    vector<string> command = {"GET", "1", "104"};
    string expectedLine = "200 Ok\n\n105 106 111 110 112 113 107 108 109 114";

    string res = cRecommend.execute(command);
    EXPECT_EQ(res, expectedLine);
}

// Check illegal arguments
TEST(RecommendCommandTest, CheckIllegalArguments) {
    IDataManager* dataManager = new LocalDataManager();
    RecommendCommand* m = new RecommendCommand(dataManager);

    // Zero arguments are illegal
    EXPECT_THROW(m->execute(vector<string>{}), StatusCodeException);

    // One argument is illegal
    EXPECT_THROW(m->execute(vector<string>{"GET"}), StatusCodeException);

    // Two arguments are also illegal
    EXPECT_THROW(m->execute(vector<string>{"GET 1"}), StatusCodeException);
}

// Check info method
TEST(RecommendCommandTest, CheckInfo) {
    IDataManager* dataManager = new LocalDataManager();
    EXPECT_EQ(RecommendCommand(dataManager).info(), "GET, arguments: [userid] [movieid]");
}