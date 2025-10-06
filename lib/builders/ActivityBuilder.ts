// Activity builder for creating activity blocks from configuration
import type { Block } from '../types/block';
import type { ActivityBuilderConfig } from '../types/activityConfig';

export class ActivityBuilder {
  static createFromConfig(config: ActivityBuilderConfig, x: number, y: number): Block {
    const startTime = new Date(config.startTime);
    const endTime = new Date(config.endTime);
    const duration = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60); // in hours

    return {
      id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x,
      y,
      width: 200, // Default width, will be calculated based on duration
      height: 60, // Default height
      title: `${config.name} - ${config.location}`,
      type: 'activity',
      color: '#8b5cf6', // Purple color for activities
      startTime,
      endTime,
      duration,
      // Snapping system
      isSnapped: false,
      snapGroupId: undefined,
      snapPosition: undefined
    };
  }

  static createActivity(
    name: string,
    location: string,
    startTime: Date,
    endTime: Date,
    x: number,
    y: number,
    category?: string,
    description?: string
  ): Block {
    const config: ActivityBuilderConfig = {
      name,
      location,
      startTime,
      endTime,
      category,
      description
    };

    return this.createFromConfig(config, x, y);
  }

  static createSightseeing(
    name: string,
    location: string,
    startTime: Date,
    endTime: Date,
    x: number,
    y: number
  ): Block {
    const config: ActivityBuilderConfig = {
      name,
      location,
      startTime,
      endTime,
      category: 'sightseeing',
      description: 'Tourist attraction or landmark visit'
    };

    return this.createFromConfig(config, x, y);
  }

  static createDining(
    name: string,
    location: string,
    startTime: Date,
    endTime: Date,
    x: number,
    y: number
  ): Block {
    const config: ActivityBuilderConfig = {
      name,
      location,
      startTime,
      endTime,
      category: 'dining',
      description: 'Restaurant or meal'
    };

    return this.createFromConfig(config, x, y);
  }

  static createEntertainment(
    name: string,
    location: string,
    startTime: Date,
    endTime: Date,
    x: number,
    y: number
  ): Block {
    const config: ActivityBuilderConfig = {
      name,
      location,
      startTime,
      endTime,
      category: 'entertainment',
      description: 'Show, concert, or entertainment venue'
    };

    return this.createFromConfig(config, x, y);
  }

  static createBusiness(
    name: string,
    location: string,
    startTime: Date,
    endTime: Date,
    x: number,
    y: number
  ): Block {
    const config: ActivityBuilderConfig = {
      name,
      location,
      startTime,
      endTime,
      category: 'business',
      description: 'Business meeting or work activity'
    };

    return this.createFromConfig(config, x, y);
  }
}
