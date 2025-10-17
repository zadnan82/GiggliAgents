"""
Base Module Class
All prefabs inherit from this
"""

import logging
from abc import ABC, abstractmethod
from typing import Dict, Any

logger = logging.getLogger(__name__)


class BaseModule(ABC):
    """
    Base class for all prefab modules

    All modules must implement the execute() method
    """

    def __init__(self, module_id: str):
        """
        Initialize module

        Args:
            module_id: Unique module identifier (e.g., 'em', 'es', 'ec')
        """
        self.module_id = module_id
        self.logger = logging.getLogger(f"module.{module_id}")
        self.logger.info(f"Module '{module_id}' initialized")

    @abstractmethod
    def execute(
        self, action: str, params: Dict[str, Any], context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Execute module action

        Args:
            action: Action to perform (e.g., 'scan_inbox', 'send_email')
            params: Action parameters
            context: Execution context containing:
                - oauth_token: OAuth token
                - provider: Provider type (gmail, outlook, etc.)
                - config: User configuration
                - tier: User tier

        Returns:
            Dict with action results

        Raises:
            ModuleExecutionError: If action fails
        """
        pass

    def validate_params(self, params: Dict[str, Any], required: list):
        """
        Validate required parameters

        Args:
            params: Parameters to validate
            required: List of required parameter names

        Raises:
            ModuleExecutionError: If validation fails
        """

        for param in required:
            if param not in params:
                raise ModuleExecutionError(f"Required parameter missing: {param}")


class ModuleExecutionError(Exception):
    """Exception raised when module execution fails"""

    pass
