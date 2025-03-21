"use client";
import React, { useEffect, useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconSearch,
  IconStethoscope,
  IconCalendar,
  IconUser,
  IconPhone,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import axios from "axios";
import { getApiBaseUrl } from "@/utils/api";

export function SidebarDemo() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const [urlPerfil, setUrlPerfil] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Cada vez que cambia la ruta, revalidamos la existencia del token en localStorage
  useEffect(() => {
    if (isClient) {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      setIsAuthenticated(!!token);
      if (token) {
        axios.get(`${getApiBaseUrl()}/api/app_user/check-role/`, {
          headers: {
            "Authorization": "Bearer " + token
          }
        })
          .then(response => {
            const role = response.data.user_role;
            if (role === "patient") {
              setUrlPerfil("/patient-management/profile/");
            } else if (role === "physiotherapist") {
              setUrlPerfil("/physio-management/profile/");
            }
          })
      }
    }
  }, [pathname, isClient, token]);

  const links = [
    {
      label: "Buscar",
      href: "/",
      icon: (
        <IconSearch className="text-[#253240] h-5 w-5 flex-shrink-0 mx-auto" />
      ),
    },
    {
      label: "Mis citas",
      href: isAuthenticated ? "/my-appointments" : "/register",
      icon: (
        <IconCalendar className="text-[#253240] h-5 w-5 flex-shrink-0 mx-auto" />
      ),
    },
    {
      label: "Tratamientos",
      href: isAuthenticated ? "#" : "/register",
      icon: (
        <IconStethoscope className="text-[#253240] h-5 w-5 flex-shrink-0 mx-auto" />
      ),
    },
    {
      label: "Mi perfil",
      href: urlPerfil ? urlPerfil : "/",
      icon: (
        <IconUser className="text-[#253240] h-5 w-5 flex-shrink-0 mx-auto" />
      ),
    },
    {
      label: "Videollamadas",
      href: "/videocalls",
      icon: (
        <IconPhone className="text-[#253240] h-5 w-5 flex-shrink-0 mx-auto" />
      ),
    },
  ];

  return (
    <div
      className={cn(
        "fixed left-0 top-0 flex flex-col md:flex-row bg-gray-50 dark:bg-neutral-900 h-screen w-[80px] border-r border-gray-200 dark:border-neutral-800 z-50"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="flex flex-col h-full justify-between py-12">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <div className="mb-16">{open ? <Logo /> : <LogoIcon />}</div>
            <div>
              <br />
            </div>
            <div className="flex flex-col gap-8">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          {/* Elimina el Link externo para evitar anidar <a>, y usa mt-auto para posicionar al final */}
          {isAuthenticated && (
            <div className="pt-2 pb-1 mt-auto cursor-pointer">
              <SidebarLink
                link={{
                  label: "Cerrar Sesión",
                  href: "/logout",
                  icon: (
                    <IconArrowLeft className="text-[#253240] h-3 w-3 flex-shrink-0 mx-auto" />
                  ),
                }}
              />
            </div>
          )}
        </SidebarBody>
      </Sidebar>
    </div>
  );
}

const Logo = () => {
  return (
    <a
      href="/"
      className="font-normal flex items-center text-sm text-[#253240] py-1 relative z-100"
    >
      <img
        src="/static/fisio_find_logo.webp"
        alt="Logo"
        className="h-8 w-auto flex-shrink-0"
        style={{ filter: "brightness(0) invert(0)" }}
      />
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="/"
      className="font-normal flex space-x-5 items-center text-base text-[#253240] py-2 relative z-100"
    >
      <img
        src="/static/fisio_find_logo.webp"
        alt="Fisio Find logo"
        className="h-6 w-auto flex-shrink-0"
        style={{ filter: "brightness(0) invert(0)" }}
      />
    </a>
  );
};
