
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import CommunityChat from "@/components/CommunityChat";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CommunityPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="bg-background min-h-screen text-foreground">
      <Header />
      <main className="pt-20 px-4 md:px-6 max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">Movie Community</CardTitle>
            <CardDescription>
              Chat with fellow movie enthusiasts, share recommendations, and provide feedback
            </CardDescription>
          </CardHeader>
        </Card>
        <CommunityChat />
      </main>
    </div>
  );
};

export default CommunityPage;
