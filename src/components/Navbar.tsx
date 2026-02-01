import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart, Home, PlusCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface NavbarProps {
  isValentinePage?: boolean;
}

const Navbar = ({ isValentinePage = false }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Home", path: "/create", icon: Home },
    { label: "Create Valentine", path: "/create", icon: PlusCircle },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-primary/10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo / Brand */}
            <motion.button
              onClick={() => navigate("/create")}
              className="flex items-center gap-2 text-primary font-romantic text-xl md:text-2xl"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Heart className="w-5 h-5 md:w-6 md:h-6 fill-primary" />
              <span>Love Page</span>
            </motion.button>

            {/* Right side - Menu or nothing based on page type */}
            {!isValentinePage && (
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-primary/10 transition-colors text-primary"
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </motion.button>
            )}

            {/* Show a subtle heart on valentine page instead of menu */}
            {isValentinePage && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="w-5 h-5 text-primary fill-primary/30" />
              </motion.div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && !isValentinePage && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-14 md:top-16 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-primary/10 shadow-lg"
            >
              <div className="container mx-auto px-4 py-3">
                <div className="flex flex-col gap-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                      <motion.button
                        key={item.label}
                        onClick={() => handleNavigation(item.path)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-primary/5 text-gray-700"
                        }`}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from going under navbar */}
      <div className="h-14 md:h-16" />
    </>
  );
};

export default Navbar;
