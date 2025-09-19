import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.4/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Ensure priority pool creation works correctly",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const poolId = 'test-pool';
    const block = chain.mineBlock([
      Tx.contractCall('priority-distributor', 'create-priority-pool', 
        [
          types.ascii(poolId),
          types.uint(3),
          types.principal(deployer.address)
        ], 
        deployer.address)
    ]);

    assertEquals(block.height, 2);
    block.receipts[0].result.expectOk().expectBool(true);
  }
});

Clarinet.test({
  name: "Verify pool access granting mechanism",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    const user = accounts.get('wallet_1')!;
    const poolId = 'grant-test-pool';

    const block = chain.mineBlock([
      // Create pool
      Tx.contractCall('priority-distributor', 'create-priority-pool', 
        [
          types.ascii(poolId),
          types.uint(3),
          types.principal(deployer.address)
        ], 
        deployer.address),
      
      // Grant access
      Tx.contractCall('priority-distributor', 'grant-pool-access', 
        [
          types.ascii(poolId),
          types.principal(user.address),
          types.uint(2)
        ], 
        deployer.address)
    ]);

    assertEquals(block.height, 2);
    block.receipts[1].result.expectOk().expectBool(true);
  }
});