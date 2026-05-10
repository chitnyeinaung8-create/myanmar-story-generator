import { toast } from "sonner";

/**
 * Copy text to clipboard with robust error handling and fallback
 */
export async function copyToClipboard(text: string, label: string = "Text"): Promise<boolean> {
  try {
    // Try modern Clipboard API first
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
      return true;
    }
  } catch (error) {
    console.warn("[Clipboard] Modern API failed, trying fallback:", error);
  }

  // Fallback for older browsers or insecure contexts
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);

    if (successful) {
      toast.success(`${label} copied to clipboard!`);
      return true;
    } else {
      throw new Error("execCommand failed");
    }
  } catch (error) {
    console.error("[Clipboard] Both methods failed:", error);
    toast.error(`Failed to copy ${label}. Please try again.`);
    return false;
  }
}
