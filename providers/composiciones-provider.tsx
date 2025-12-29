import useComposiciones from "@/hooks/useComposiciones";
import { createContext, useContext } from "react";

type ComposicionesProviderProps = {
	children: React.ReactNode;
};

type ComposicionesContextType = ReturnType<typeof useComposiciones>;

const ComposicionesContext = createContext<ComposicionesContextType | undefined>(undefined);

export const useComposicionesContext = () => {
	const context = useContext(ComposicionesContext);
	if (!context) {
		throw new Error("Context error");
	}
	return context;
};

const ComposicionesProvider: React.FC<ComposicionesProviderProps> = ({ children }) => {
	const { composiciones, loading, reload } = useComposiciones();

	const contextValue = {
		composiciones,
		loading,
		reload
	};
	return <ComposicionesContext.Provider value={contextValue}>{children}</ComposicionesContext.Provider>;
};
export default ComposicionesProvider;
