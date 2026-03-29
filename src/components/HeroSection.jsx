import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { MessageSquare, Send, Users, Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-background h-[calc(100vh-3.5rem)] flex items-center">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-indigo-900/20 via-purple-900/10 to-background -z-10"></div>
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary/20 blur-3xl rounded-full opacity-50 -z-10"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-indigo-500/20 blur-3xl rounded-full opacity-50 -z-10"></div>

      <div className="container px-4 md:px-8 mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center space-y-6 max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
            <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary w-fit mx-auto lg:mx-0">
              <Zap className="mr-2 h-4 w-4" />
              <span>Introducing AI-Powered Pulse Chat 2.0</span>
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-5xl/none text-foreground leading-tight">
              Connect with your team <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-indigo-400">
                without language barriers.
              </span>
            </h1>

            <p className="max-w-[600px] text-lg text-muted-foreground sm:text-xl mx-auto lg:mx-0">
              An AI-powered messaging platform featuring live text translation.
              Experience seamless remote collaboration across the globe.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/chat">
                <Button
                  size="lg"
                  className="w-full sm:w-auto font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all text-md px-8"
                >
                  Start Chatting
                </Button>
              </Link>
              <Link to="/features">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto font-semibold text-md px-8 border-border bg-background/50 backdrop-blur-sm"
                >
                  Explore Features
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground justify-center lg:justify-start pt-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-background bg-secondary flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                      alt="user"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <p>
                Trusted by{" "}
                <span className="text-foreground font-semibold">10,000+</span>{" "}
                teams
              </p>
            </div>
          </div>

          {/* Right Content - Chat Mockup */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            {/* Decorative elements behind mockup */}
            <div className="absolute -inset-1 bg-linear-to-r from-primary to-indigo-500 rounded-2xl blur opacity-25"></div>

            <div className="relative rounded-2xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col h-[450px]">
              {/* Mockup Header */}
              <div className="flex items-center p-4 border-b border-border/50 bg-background/50">
                <div className="flex space-x-2 mr-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="flex items-center justify-center bg-secondary/50 rounded-md px-3 py-1 flex-1 border border-border/50">
                  <Users className="w-3 h-3 mr-2 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-medium">
                    Engineering Team
                  </span>
                </div>
              </div>

              {/* Mockup Body */}
              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 space-y-4">
                {/* Message 1 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 shrink-0 flex items-center justify-center border border-indigo-500/30">
                    <span className="text-xs font-bold text-indigo-400">
                      JD
                    </span>
                  </div>
                  <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%] border border-border/50">
                    <p className="text-sm">
                      Hola equipo! La nueva versión está lista. 🚀
                    </p>
                    <p className="text-xs text-primary mt-1 border-t border-border/50 pt-1 flex items-center gap-1">
                      <Zap className="h-3 w-3" /> Translated to: Hey team! The
                      new version is ready. 🚀
                    </p>
                  </div>
                </div>

                {/* Message 2 */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-500/20 shrink-0 flex items-center justify-center border border-teal-500/30">
                    <span className="text-xs font-bold text-teal-400">AM</span>
                  </div>
                  <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%] border border-border/50">
                    <p className="text-sm">
                      This AI live translation is incredible. We can finally
                      collaborate seamlessly!
                    </p>
                  </div>
                </div>

                {/* Message 3 (Current user) */}
                <div className="flex items-start gap-3 flex-row-reverse">
                  <div className="w-8 h-8 rounded-full bg-primary/20 shrink-0 flex items-center justify-center border border-primary/30">
                    <span className="text-xs font-bold text-primary">ME</span>
                  </div>
                  <div className="bg-primary/20 rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%] border border-primary/30">
                    <p className="text-sm text-foreground">
                      Exactly! Just press the voice button to try the new live
                      voice translation feature.
                    </p>
                  </div>
                </div>
              </div>

              {/* Mockup Input */}
              <div className="p-4 bg-background/50 border-t border-border/50">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full bg-secondary/50 border border-border/50 rounded-full pl-4 pr-12 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-white placeholder:text-muted-foreground"
                    value="Ready for the next sprint|"
                    readOnly
                  />
                  <div className="absolute right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform">
                    <Send className="w-4 h-4 text-primary-foreground ml-0.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
