
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const startDate = new Date("2025-07-01");
const daysInMonth = 30;
const defaultTasks = ["Study (30 mins)", "Workout (15–30 mins)", "Reflection"];
const weeklyGoals = [
  {
    title: "Complete 1 full SAT test",
    description: "Take a full timed SAT practice test using Bluebook or paper. Review all mistakes."
  },
  {
    title: "Run 5km under 25 minutes",
    description: "Attempt one 5K test run this week. Focus on pacing and breathing."
  },
  {
    title: "Complete daily tasks 6 out of 7 days",
    description: "Stay consistent with study, workout, and reflection for at least 6 days."
  }
];

function formatDate(index) {
  const date = new Date(startDate);
  date.setDate(startDate.getDate() + index);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function MonthlyProgressTracker() {
  const [tasks, setTasks] = useState(
    Array.from({ length: daysInMonth }, () => ({ completed: [false, false, false], notes: "" }))
  );

  const today = new Date();
  const todayIndex = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  const [view, setView] = useState("daily");

  const toggleTask = (dayIndex, taskIndex) => {
    setTasks((prev) => {
      const updated = [...prev];
      updated[dayIndex].completed[taskIndex] = !updated[dayIndex].completed[taskIndex];
      return updated;
    });
  };

  const updateNotes = (dayIndex, value) => {
    setTasks((prev) => {
      const updated = [...prev];
      updated[dayIndex].notes = value;
      return updated;
    });
  };

  const renderTodayView = () => {
    if (todayIndex < 0 || todayIndex >= daysInMonth) {
      return <p className="text-center text-muted-foreground">Today is outside your 30-day plan (starts July 1).</p>;
    }
    const todayTask = tasks[todayIndex];
    return (
      <Card className="shadow-xl">
        <CardContent className="p-4">
          <h2 className="font-bold text-xl mb-4">📅 Today’s Plan ({formatDate(todayIndex)})</h2>
          {defaultTasks.map((task, j) => (
            <div key={j} className="mb-2">
              <h3 className="font-semibold">🎯 {task}</h3>
              <Button
                variant={todayTask.completed[j] ? "default" : "outline"}
                className="w-full mt-1"
                onClick={() => toggleTask(todayIndex, j)}
              >
                {todayTask.completed[j] ? "✅ Done" : "⬜️ Mark as done"}
              </Button>
              <Textarea
                className="mt-2"
                placeholder={`Details for: ${task}`}
                value={todayTask.notes}
                onChange={(e) => updateNotes(todayIndex, e.target.value)}
              />
            </div>
          ))}
          <div className="mt-4">
            <h3 className="font-bold text-lg mb-2">📌 Weekly Goals</h3>
            {weeklyGoals.map((goal, i) => (
              <div key={i} className="mb-2">
                <p className="font-semibold">✅ {goal.title}</p>
                <p className="text-sm text-muted-foreground">{goal.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderWeeklyView = () => (
    <Card className="shadow-xl">
      <CardContent className="p-4">
        <h2 className="font-bold text-xl mb-4">📆 Weekly Overview</h2>
        {weeklyGoals.map((goal, i) => (
          <div key={i} className="mb-4">
            <h3 className="font-semibold text-lg">✅ {goal.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{goal.description}</p>
          </div>
        ))}
        <div className="mt-4">
          <h3 className="font-bold text-lg mb-2">📅 Today’s Quick View</h3>
          {defaultTasks.map((task, j) => (
            <p key={j}>- {task}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const renderAdjustView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tasks.map((day, i) => (
        <Card key={i} className="shadow-xl">
          <CardContent className="p-4">
            <h2 className="font-bold text-lg mb-2">{formatDate(i)}</h2>
            <div className="space-y-2">
              {defaultTasks.map((task, j) => (
                <Button
                  key={j}
                  variant={day.completed[j] ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => toggleTask(i, j)}
                >
                  {day.completed[j] ? "✅" : "⬜️"} {task}
                </Button>
              ))}
              <Textarea
                placeholder="Reflection / Adjustments / Notes"
                value={day.notes}
                onChange={(e) => updateNotes(i, e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <Button onClick={() => setView("daily")}>📅 Today’s Plan</Button>
        <Button onClick={() => setView("weekly")}>📆 Weekly Goals</Button>
        <Button onClick={() => setView("adjust")}>⚙️ Adjust Plan</Button>
      </div>
      {view === "daily" && renderTodayView()}
      {view === "weekly" && renderWeeklyView()}
      {view === "adjust" && renderAdjustView()}
    </div>
  );
}
