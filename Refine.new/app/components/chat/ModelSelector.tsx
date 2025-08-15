import type { ProviderInfo } from '~/types/model';
import { useEffect, useState, useRef } from 'react';
import type { KeyboardEvent } from 'react';
import type { ModelInfo } from '~/lib/modules/llm/types';
import { classNames } from '~/utils/classNames';

interface ModelSelectorProps {
  model?: string;
  setModel?: (model: string) => void;
  provider?: ProviderInfo;
  setProvider?: (provider: ProviderInfo) => void;
  modelList: ModelInfo[];
  providerList: ProviderInfo[];
  apiKeys: Record<string, string>;
  modelLoading?: string;
}

// Helper function to determine if a model is likely free
const isModelLikelyFree = (model: ModelInfo, providerName?: string): boolean => {
  // OpenRouter models with zero pricing in the label
  if (providerName === 'OpenRouter' && model.label.includes('in:$0.00') && model.label.includes('out:$0.00')) {
    return true;
  }

  // Models with "free" in the name or label
  if (model.name.toLowerCase().includes('free') || model.label.toLowerCase().includes('free')) {
    return true;
  }

  return false;
};

export const ModelSelector = ({
  model,
  setModel,
  provider,
  setProvider,
  modelList,
  providerList,
  modelLoading,
}: ModelSelectorProps) => {
  const [modelSearchQuery, setModelSearchQuery] = useState('');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [focusedModelIndex, setFocusedModelIndex] = useState(-1);
  const modelSearchInputRef = useRef<HTMLInputElement>(null);
  const modelOptionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const [providerSearchQuery, setProviderSearchQuery] = useState('');
  const [isProviderDropdownOpen, setIsProviderDropdownOpen] = useState(false);
  const [focusedProviderIndex, setFocusedProviderIndex] = useState(-1);
  const providerSearchInputRef = useRef<HTMLInputElement>(null);
  const providerOptionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const providerDropdownRef = useRef<HTMLDivElement>(null);
  const [showFreeModelsOnly, setShowFreeModelsOnly] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
        setModelSearchQuery('');
      }

      if (providerDropdownRef.current && !providerDropdownRef.current.contains(event.target as Node)) {
        setIsProviderDropdownOpen(false);
        setProviderSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredModels = [...modelList]
    .filter((e) => e.provider === provider?.name && e.name)
    .filter((model) => {
      // Apply free models filter
      if (showFreeModelsOnly && !isModelLikelyFree(model, provider?.name)) {
        return false;
      }

      // Apply search filter
      return (
        model.label.toLowerCase().includes(modelSearchQuery.toLowerCase()) ||
        model.name.toLowerCase().includes(modelSearchQuery.toLowerCase())
      );
    });

  const filteredProviders = providerList.filter((p) =>
    p.name.toLowerCase().includes(providerSearchQuery.toLowerCase()),
  );

  // Reset free models filter when provider changes
  useEffect(() => {
    setShowFreeModelsOnly(false);
  }, [provider?.name]);

  useEffect(() => {
    setFocusedModelIndex(-1);
  }, [modelSearchQuery, isModelDropdownOpen, showFreeModelsOnly]);

  useEffect(() => {
    setFocusedProviderIndex(-1);
  }, [providerSearchQuery, isProviderDropdownOpen]);

  useEffect(() => {
    if (isModelDropdownOpen && modelSearchInputRef.current) {
      modelSearchInputRef.current.focus();
    }
  }, [isModelDropdownOpen]);

  useEffect(() => {
    if (isProviderDropdownOpen && providerSearchInputRef.current) {
      providerSearchInputRef.current.focus();
    }
  }, [isProviderDropdownOpen]);

  const handleModelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isModelDropdownOpen) {
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedModelIndex((prev) => (prev + 1 >= filteredModels.length ? 0 : prev + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedModelIndex((prev) => (prev - 1 < 0 ? filteredModels.length - 1 : prev - 1));
        break;
      case 'Enter':
        e.preventDefault();

        if (focusedModelIndex >= 0 && focusedModelIndex < filteredModels.length) {
          const selectedModel = filteredModels[focusedModelIndex];
          setModel?.(selectedModel.name);
          setIsModelDropdownOpen(false);
          setModelSearchQuery('');
        }

        break;
      case 'Escape':
        e.preventDefault();
        setIsModelDropdownOpen(false);
        setModelSearchQuery('');
        break;
      case 'Tab':
        if (!e.shiftKey && focusedModelIndex === filteredModels.length - 1) {
          setIsModelDropdownOpen(false);
        }

        break;
    }
  };

  const handleProviderKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!isProviderDropdownOpen) {
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedProviderIndex((prev) => (prev + 1 >= filteredProviders.length ? 0 : prev + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedProviderIndex((prev) => (prev - 1 < 0 ? filteredProviders.length - 1 : prev - 1));
        break;
      case 'Enter':
        e.preventDefault();

        if (focusedProviderIndex >= 0 && focusedProviderIndex < filteredProviders.length) {
          const selectedProvider = filteredProviders[focusedProviderIndex];

          if (setProvider) {
            setProvider(selectedProvider);

            const firstModel = modelList.find((m) => m.provider === selectedProvider.name);

            if (firstModel && setModel) {
              setModel(firstModel.name);
            }
          }

          setIsProviderDropdownOpen(false);
          setProviderSearchQuery('');
        }

        break;
      case 'Escape':
        e.preventDefault();
        setIsProviderDropdownOpen(false);
        setProviderSearchQuery('');
        break;
      case 'Tab':
        if (!e.shiftKey && focusedProviderIndex === filteredProviders.length - 1) {
          setIsProviderDropdownOpen(false);
        }

        break;
    }
  };

  useEffect(() => {
    if (focusedModelIndex >= 0 && modelOptionsRef.current[focusedModelIndex]) {
      modelOptionsRef.current[focusedModelIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedModelIndex]);

  useEffect(() => {
    if (focusedProviderIndex >= 0 && providerOptionsRef.current[focusedProviderIndex]) {
      providerOptionsRef.current[focusedProviderIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedProviderIndex]);

  useEffect(() => {
    if (providerList.length === 0) {
      return;
    }

    if (provider && !providerList.some((p) => p.name === provider.name)) {
      const firstEnabledProvider = providerList[0];
      setProvider?.(firstEnabledProvider);

      const firstModel = modelList.find((m) => m.provider === firstEnabledProvider.name);

      if (firstModel) {
        setModel?.(firstModel.name);
      }
    }
  }, [providerList, provider, setProvider, modelList, setModel]);

  if (providerList.length === 0) {
    return (
      <div className="mb-2 p-4 rounded-lg border border-refine-elements-borderColor bg-refine-elements-prompt-background text-refine-elements-textPrimary">
        <p className="text-center">
          No providers are currently enabled. Please enable at least one provider in the settings to start using the
          chat.
        </p>
      </div>
    );
  }

  return (
    <div className="flex gap-3 flex-col sm:flex-row relative">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5 rounded-2xl blur-xl -z-10" />
      {/* Provider Combobox */}
      <div className="relative flex w-full" onKeyDown={handleProviderKeyDown} ref={providerDropdownRef}>
        <div
          className={classNames(
            'w-full p-3 rounded-xl border border-bolt-elements-borderColor',
            'model-selector-glass hardware-accelerated',
            'text-bolt-elements-textPrimary',
            'focus-within:outline-none focus-within:ring-2 focus-within:ring-accent-500/50',
            'transition-all duration-300 cursor-pointer',
            'shadow-lg hover:shadow-xl',
            isProviderDropdownOpen ? 'ring-2 ring-accent-500/50' : undefined,
          )}
          onClick={() => setIsProviderDropdownOpen(!isProviderDropdownOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsProviderDropdownOpen(!isProviderDropdownOpen);
            }
          }}
          role="combobox"
          aria-expanded={isProviderDropdownOpen}
          aria-controls="provider-listbox"
          aria-haspopup="listbox"
          tabIndex={0}
        >
          <div className="flex items-center justify-between">
            <div className="truncate">{provider?.name || 'Select provider'}</div>
            <div
              className={classNames(
                'i-ph:caret-down w-5 h-5 text-bolt-elements-textSecondary opacity-75',
                'transition-transform duration-300',
                isProviderDropdownOpen ? 'rotate-180' : undefined,
              )}
            />
          </div>
        </div>

        {isProviderDropdownOpen && (
          <div
            className="absolute z-20 w-full mt-2 py-2 rounded-xl border border-bolt-elements-borderColor bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl"
            role="listbox"
            id="provider-listbox"
          >
            <div className="px-2 pb-2">
              <div className="relative">
                <input
                  ref={providerSearchInputRef}
                  type="text"
                  value={providerSearchQuery}
                  onChange={(e) => setProviderSearchQuery(e.target.value)}
                  placeholder="Search providers..."
                  className={classNames(
                    'w-full pl-2 py-1.5 rounded-md text-sm',
                    'bg-refine-elements-background-depth-2 border border-refine-elements-borderColor',
                    'text-refine-elements-textPrimary placeholder:text-refine-elements-textTertiary',
                    'focus:outline-none focus:ring-2 focus:ring-refine-elements-focus',
                    'transition-all',
                  )}
                  onClick={(e) => e.stopPropagation()}
                  role="searchbox"
                  aria-label="Search providers"
                />
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2">
                  <span className="i-ph:magnifying-glass text-refine-elements-textTertiary" />
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'max-h-60 overflow-y-auto',
                'sm:scrollbar-none',
                '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2',
                '[&::-webkit-scrollbar-thumb]:bg-refine-elements-borderColor',
                '[&::-webkit-scrollbar-thumb]:hover:bg-refine-elements-borderColorHover',
                '[&::-webkit-scrollbar-thumb]:rounded-full',
                '[&::-webkit-scrollbar-track]:bg-refine-elements-background-depth-2',
                '[&::-webkit-scrollbar-track]:rounded-full',
                'sm:[&::-webkit-scrollbar]:w-1.5 sm:[&::-webkit-scrollbar]:h-1.5',
                'sm:hover:[&::-webkit-scrollbar-thumb]:bg-refine-elements-borderColor/50',
                'sm:hover:[&::-webkit-scrollbar-thumb:hover]:bg-refine-elements-borderColor',
                'sm:[&::-webkit-scrollbar-track]:bg-transparent',
              )}
            >
              {filteredProviders.length === 0 ? (
                <div className="px-4 py-3 text-sm text-bolt-elements-textTertiary">No providers found</div>
              ) : (
                filteredProviders.map((providerOption, index) => (
                  <div
                    ref={(el) => (providerOptionsRef.current[index] = el)}
                    key={providerOption.name}
                    role="option"
                    aria-selected={provider?.name === providerOption.name}
                    className={classNames(
                      'px-4 py-3 text-sm cursor-pointer rounded-lg mx-2 my-1',
                      'hover:bg-white/20 dark:hover:bg-gray-800/30',
                      'text-bolt-elements-textPrimary',
                      'outline-none transition-all duration-200',
                      'hover:shadow-md',
                      provider?.name === providerOption.name || focusedProviderIndex === index
                        ? 'bg-accent-500/20 text-accent-600 dark:text-accent-400'
                        : undefined,
                      focusedProviderIndex === index ? 'ring-2 ring-accent-500/50' : undefined,
                    )}
                    onClick={(e) => {
                      e.stopPropagation();

                      if (setProvider) {
                        setProvider(providerOption);

                        const firstModel = modelList.find((m) => m.provider === providerOption.name);

                        if (firstModel && setModel) {
                          setModel(firstModel.name);
                        }
                      }

                      setIsProviderDropdownOpen(false);
                      setProviderSearchQuery('');
                    }}
                    tabIndex={focusedProviderIndex === index ? 0 : -1}
                  >
                    {providerOption.name}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Model Combobox */}
      <div className="relative flex w-full min-w-[70%]" onKeyDown={handleModelKeyDown} ref={modelDropdownRef}>
        <div
          className={classNames(
            'w-full p-3 rounded-xl border border-bolt-elements-borderColor',
            'model-selector-glass hardware-accelerated',
            'text-bolt-elements-textPrimary',
            'focus-within:outline-none focus-within:ring-2 focus-within:ring-accent-500/50',
            'transition-all duration-300 cursor-pointer',
            'shadow-lg hover:shadow-xl',
            isModelDropdownOpen ? 'ring-2 ring-accent-500/50' : undefined,
          )}
          onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsModelDropdownOpen(!isModelDropdownOpen);
            }
          }}
          role="combobox"
          aria-expanded={isModelDropdownOpen}
          aria-controls="model-listbox"
          aria-haspopup="listbox"
          tabIndex={0}
        >
          <div className="flex items-center justify-between">
            <div className="truncate">{modelList.find((m) => m.name === model)?.label || 'Select model'}</div>
            <div
              className={classNames(
                'i-ph:caret-down w-4 h-4 text-refine-elements-textSecondary opacity-75',
                isModelDropdownOpen ? 'rotate-180' : undefined,
              )}
            />
          </div>
        </div>

        {isModelDropdownOpen && (
          <div
            className="absolute z-10 w-full mt-2 py-2 rounded-xl border border-bolt-elements-borderColor bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl"
            role="listbox"
            id="model-listbox"
          >
            <div className="px-2 pb-2 space-y-2">
              {/* Free Models Filter Toggle - Only show for OpenRouter */}
              {provider?.name === 'OpenRouter' && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowFreeModelsOnly(!showFreeModelsOnly);
                    }}
                    className={classNames(
                      'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all',
                      'hover:bg-refine-elements-background-depth-3',
                      showFreeModelsOnly
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'bg-refine-elements-background-depth-3 text-refine-elements-textSecondary border border-refine-elements-borderColor',
                    )}
                  >
                    <span className="i-ph:gift text-xs" />
                    Free models only
                  </button>
                  {showFreeModelsOnly && (
                    <span className="text-xs text-refine-elements-textTertiary">
                      {filteredModels.length} free model{filteredModels.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              )}

              {/* Search Input */}
              <div className="relative">
                <input
                  ref={modelSearchInputRef}
                  type="text"
                  value={modelSearchQuery}
                  onChange={(e) => setModelSearchQuery(e.target.value)}
                  placeholder="Search models..."
                  className={classNames(
                    'w-full pl-2 py-1.5 rounded-md text-sm',
                    'bg-refine-elements-background-depth-2 border border-refine-elements-borderColor',
                    'text-refine-elements-textPrimary placeholder:text-refine-elements-textTertiary',
                    'focus:outline-none focus:ring-2 focus:ring-refine-elements-focus',
                    'transition-all',
                  )}
                  onClick={(e) => e.stopPropagation()}
                  role="searchbox"
                  aria-label="Search models"
                />
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2">
                  <span className="i-ph:magnifying-glass text-refine-elements-textTertiary" />
                </div>
              </div>
            </div>

            <div
              className={classNames(
                'max-h-60 overflow-y-auto',
                'sm:scrollbar-none',
                '[&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2',
                '[&::-webkit-scrollbar-thumb]:bg-refine-elements-borderColor',
                '[&::-webkit-scrollbar-thumb]:hover:bg-refine-elements-borderColorHover',
                '[&::-webkit-scrollbar-thumb]:rounded-full',
                '[&::-webkit-scrollbar-track]:bg-refine-elements-background-depth-2',
                '[&::-webkit-scrollbar-track]:rounded-full',
                'sm:[&::-webkit-scrollbar]:w-1.5 sm:[&::-webkit-scrollbar]:h-1.5',
                'sm:hover:[&::-webkit-scrollbar-thumb]:bg-refine-elements-borderColor/50',
                'sm:hover:[&::-webkit-scrollbar-thumb:hover]:bg-refine-elements-borderColor',
                'sm:[&::-webkit-scrollbar-track]:bg-transparent',
              )}
            >
              {modelLoading === 'all' || modelLoading === provider?.name ? (
                <div className="px-3 py-2 text-sm text-refine-elements-textTertiary">Loading...</div>
              ) : filteredModels.length === 0 ? (
                <div className="px-3 py-2 text-sm text-refine-elements-textTertiary">
                  {showFreeModelsOnly ? 'No free models found' : 'No models found'}
                </div>
              ) : (
                filteredModels.map((modelOption, index) => (
                  <div
                    ref={(el) => (modelOptionsRef.current[index] = el)}
                    key={index} // Consider using modelOption.name if unique
                    role="option"
                    aria-selected={model === modelOption.name}
                    className={classNames(
                      'px-3 py-2 text-sm cursor-pointer',
                      'hover:bg-refine-elements-background-depth-3',
                      'text-refine-elements-textPrimary',
                      'outline-none',
                      model === modelOption.name || focusedModelIndex === index
                        ? 'bg-refine-elements-background-depth-2'
                        : undefined,
                      focusedModelIndex === index ? 'ring-1 ring-inset ring-refine-elements-focus' : undefined,
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      setModel?.(modelOption.name);
                      setIsModelDropdownOpen(false);
                      setModelSearchQuery('');
                    }}
                    tabIndex={focusedModelIndex === index ? 0 : -1}
                  >
                    <div className="flex items-center justify-between">
                      <span>{modelOption.label}</span>
                      {isModelLikelyFree(modelOption, provider?.name) && (
                        <span className="i-ph:gift text-xs text-purple-400 ml-2" title="Free model" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
