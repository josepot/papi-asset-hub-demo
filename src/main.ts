import { start } from "polkadot-api/smoldot"
import { chainSpec as polkadotChainspec } from "polkadot-api/chains/polkadot"
import { chainSpec as ahChainspec } from "polkadot-api/chains/polkadot_asset_hub"
import { getSmProvider } from "polkadot-api/sm-provider"
import { createClient } from "polkadot-api"
import { assetHub } from "@polkadot-api/descriptors"

const smoldot = start()

const polkadot = await smoldot.addChain({
  chainSpec: polkadotChainspec,
  disableJsonRpc: true,
})

const acalaChain = smoldot.addChain({
  chainSpec: ahChainspec,
  potentialRelayChains: [polkadot],
})

const client = createClient(getSmProvider(acalaChain))

const acalaApi = client.getTypedApi(assetHub)

const allAssets = (await acalaApi.query.Assets.Metadata.getEntries()).map(
  ({ keyArgs: [assetId], value }) => ({
    assetId,
    ...value,
    symbol: value.symbol.asText(),
    name: value.name.asText(),
  }),
)

console.log(allAssets)

client.destroy()
smoldot.terminate()
process.exit(0)
