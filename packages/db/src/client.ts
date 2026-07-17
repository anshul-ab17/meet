import neo4j, { Driver } from "neo4j-driver";

export class Neo4jClient {
  private static instance: Neo4jClient;
  private driver: Driver | null = null;
  public isInMemory = false;

  private constructor() {
    const uri = process.env.NEO4J_URI;
    const user = process.env.NEO4J_USER;
    const password = process.env.NEO4J_PASSWORD;

    if (!uri || !user || !password) {
      console.warn("⚠️ Neo4j environment variables missing. Falling back to In-Memory mode.");
      this.isInMemory = true;
      return;
    }

    try {
      this.driver = neo4j.driver(
        uri,
        neo4j.auth.basic(user, password)
      );
    } catch (e) {
      console.warn("⚠️ Failed to initialize Neo4j driver. Falling back to In-Memory mode.", e);
      this.isInMemory = true;
    }
  }

  static getInstance() {
    if (!Neo4jClient.instance) {
      Neo4jClient.instance = new Neo4jClient();
    }
    return Neo4jClient.instance;
  }

  getSession() {
    if (this.isInMemory || !this.driver) {
      throw new Error("Cannot get session in in-memory mode");
    }
    return this.driver.session();
  }

  async verifyConnectivity() {
    if (this.driver) {
      await this.driver.verifyConnectivity();
    }
  }

  async close() {
    if (this.driver) {
      await this.driver.close();
    }
  }
}