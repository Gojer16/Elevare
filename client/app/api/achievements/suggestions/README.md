# AI Achievement Suggestions API

## `/api/achievements/suggestions`

### `GET`

Provides intelligent, AI-powered suggestions for which achievements a user should focus on next.

**Description:**
This endpoint analyzes the user's current progress, behavior patterns, and the structure of the achievements themselves to provide actionable recommendations. The goal is to guide the user towards the most rewarding and effective path for unlocking new achievements and staying engaged.

**Authentication:**
This endpoint requires the user to be authenticated.

**Features:**

-   **Next Best Achievement:** Identifies the single best achievement to work on next based on a strategic scoring algorithm that considers progress, difficulty, and other factors.
-   **Domino Effect Analysis:** Highlights "gateway" achievements that, once unlocked, will pave the way for unlocking a series of other related achievements.
-   **User Pattern Recognition:** Identifies if the user is focused on tasks, reflections, or maintaining a streak and can tailor suggestions to match their current behavior.
-   **Personalized Recommendations:** Provides a list of specific, actionable recommendations, such as "quick wins" (achievements that are very close to being unlocked).

**Responses:**

-   `200 OK`: Successfully generated and returned achievement suggestions.
-   `401 Unauthorized`: If the user is not authenticated.
-   `500 Internal Server Error`: If there was an error on the server.

**Example Response (200 OK):**
```json
{
  "suggestions": {
    "nextBest": {
      "id": "clxne336b000108l3f2g3h4j6",
      "code": "tasks_10",
      "title": "Task Enthusiast",
      "description": "Complete 10 tasks.",
      "progressPercent": 70,
      "score": 85.5
    },
    "dominoEffects": [
      {
        "trigger": "first_task",
        "unlocks": ["tasks_10", "tasks_100"],
        "description": "Completing your first task starts the task achievement chain"
      }
    ],
    "patterns": [
      {
        "type": "task_focused",
        "strength": 70,
        "description": "User is actively completing tasks"
      }
    ],
    "recommendations": [
      {
        "type": "quick_win",
        "achievement": {
          "id": "clxne336b000108l3f2g3h4j6",
          "code": "tasks_10",
          "title": "Task Enthusiast"
        },
        "reason": "Only 3 more to unlock!",
        "priority": "high"
      }
    ]
  },
  "userStats": {
    "tasksCompleted": 7,
    "reflectionsWritten": 2,
    "streakCount": 4,
    "longestStreak": 5
  }
}
```
