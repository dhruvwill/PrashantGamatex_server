import { Router, Request, Response } from "express";
import { authenticateJWT } from "../middleware/authenticateJWT";
import { FirebaseMessagingService } from "../services/FirebaseMessagingService";
import { Notification } from "../models/notification";

const notificationRouter = Router();
const messagingService = new FirebaseMessagingService();

// Send notification to a specific device
notificationRouter.post(
  "/send/device",
  // authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const { token, title, body, data } = req.body;
      
      if (!token || !title || !body) {
        return res.status(400).json({ 
          error: "Token, title, and body are required" 
        });
      }

      const notification: Notification = {
        token,
        title,
        body,
        data
      };

      const result = await messagingService.sendToDevice(notification);
      
      if (result.success) {
        return res.status(200).json({
          success: true,
          messageId: result.messageId
        });
      } else {
        return res.status(500).json({
          success: false,
          error: result.error
        });
      }
    } catch (error: any) {
      console.error("Error sending notification:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Send notification to a topic
notificationRouter.post(
  "/send/topic",
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const { topic, title, body, data } = req.body;
      
      if (!topic || !title || !body) {
        return res.status(400).json({ 
          error: "Topic, title, and body are required" 
        });
      }

      const notification: Notification = {
        topic,
        title,
        body,
        data
      };

      const result = await messagingService.sendToTopic(notification);
      
      if (result.success) {
        return res.status(200).json({
          success: true,
          messageId: result.messageId
        });
      } else {
        return res.status(500).json({
          success: false,
          error: result.error
        });
      }
    } catch (error: any) {
      console.error("Error sending notification to topic:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Subscribe tokens to a topic
notificationRouter.post(
  "/topic/subscribe",
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const { tokens, topic } = req.body;
      
      if (!tokens || !tokens.length || !topic) {
        return res.status(400).json({ 
          error: "Tokens array and topic are required" 
        });
      }

      const result = await messagingService.subscribeToTopic(tokens, topic);
      
      if (result) {
        return res.status(200).json({
          success: true,
          message: `Successfully subscribed to topic: ${topic}`
        });
      } else {
        return res.status(500).json({
          success: false,
          message: `Failed to subscribe to topic: ${topic}`
        });
      }
    } catch (error: any) {
      console.error("Error subscribing to topic:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

// Unsubscribe tokens from a topic
notificationRouter.post(
  "/topic/unsubscribe",
  authenticateJWT,
  async (req: Request, res: Response) => {
    try {
      const { tokens, topic } = req.body;
      
      if (!tokens || !tokens.length || !topic) {
        return res.status(400).json({ 
          error: "Tokens array and topic are required" 
        });
      }

      const result = await messagingService.unsubscribeFromTopic(tokens, topic);
      
      if (result) {
        return res.status(200).json({
          success: true,
          message: `Successfully unsubscribed from topic: ${topic}`
        });
      } else {
        return res.status(500).json({
          success: false,
          message: `Failed to unsubscribe from topic: ${topic}`
        });
      }
    } catch (error: any) {
      console.error("Error unsubscribing from topic:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

export default notificationRouter;