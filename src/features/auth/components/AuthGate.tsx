
import { useEffect } from "react";
import type { ReactNode } from "react";

import { supabase } from "../../../utils/supabase";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setUser } from "../authSlice";

import {
  fetchTransactions,
  clearTransactions,
} from "../../transactions/transactionsSlice";

import AuthPage from "./AuthPage";

export default function AuthGate({
  children,
}: {
  children: ReactNode;
}) {
  const dispatch = useAppDispatch();

  const { user, initializing } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        dispatch(setUser(null));
        return;
      }

      const sessionOnly =
        localStorage.getItem("remember") === "0" &&
        !sessionStorage.getItem("session-only");

      if (data.session && sessionOnly) {
        await supabase.auth.signOut();

        if (mounted) {
          dispatch(setUser(null));
        }
      } else {
        dispatch(setUser(data.session?.user ?? null));
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setUser(session?.user ?? null));
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchTransactions());
    } else {
      dispatch(clearTransactions());
    }
  }, [user?.id, dispatch]);

  if (initializing) {
    return (
      <div className="auth-loading">
        Loading…
      </div>
    );
  }

  return user ? <>{children}</> : <AuthPage />;
}
