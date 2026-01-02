import React, { useState } from "react";
import { Moon, Sun, Bell, UserCog } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function SettingsManagement() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your application preferences and account options.
        </p>
      </div>

      {/* Theme Settings */}
      <Card className="hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sun className="w-5 h-5 text-yellow-500" />
            <span>Appearance</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between py-4">
          <Label htmlFor="dark-mode" className="text-sm text-gray-700 dark:text-gray-300">
            Dark Mode
          </Label>
          <Switch
            id="dark-mode"
            checked={darkMode}
            onCheckedChange={setDarkMode}
          />
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="w-5 h-5 text-blue-500" />
            <span>Notifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between py-4">
          <Label htmlFor="notifications" className="text-sm text-gray-700 dark:text-gray-300">
            Enable Notifications
          </Label>
          <Switch
            id="notifications"
            checked={notifications}
            onCheckedChange={setNotifications}
          />
        </CardContent>
      </Card>

      {/* Account Preferences */}
      <Card className="hover:shadow-md transition-shadow duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserCog className="w-5 h-5 text-purple-500" />
            <span>Account</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="py-4 text-gray-600 dark:text-gray-400">
          <p>Manage your profile information and linked accounts.</p>
          <button className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition">
            Go to Profile
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

export default SettingsManagement;
